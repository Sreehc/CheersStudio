"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as authService from "@/lib/services/auth";
import * as categoriesService from "@/lib/services/categories";
import * as postsService from "@/lib/services/posts";
import * as projectsService from "@/lib/services/projects";
import * as siteService from "@/lib/services/site";
import { defaultStudioStore } from "@/lib/services/store";
import * as uploadsService from "@/lib/services/uploads";
import type {
  AuthSession,
  Category,
  Credentials,
  Post,
  PostInput,
  Project,
  ProjectInput,
  SiteSettings,
  StudioStore,
  UploadAsset,
} from "@/types";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

type StudioDataContextValue = {
  store: StudioStore;
  isStoreLoading: boolean;
  publicProjects: Project[];
  featuredProjects: Project[];
  publicPosts: Post[];
  featuredPosts: Post[];
  categories: Category[];
  createProject: (input: ProjectInput) => Promise<Project>;
  updateProject: (id: string, input: ProjectInput) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  createPost: (input: PostInput) => Promise<Post>;
  updatePost: (id: string, input: PostInput) => Promise<Post | null>;
  deletePost: (id: string) => Promise<void>;
  createCategory: (input: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, input: Omit<Category, "id">) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  updateSiteSettings: (input: SiteSettings) => Promise<void>;
  uploadAsset: (file: File, moduleType?: string) => Promise<UploadAsset>;
  refreshStore: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const StudioDataContext = createContext<StudioDataContextValue | null>(null);

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StudioDataProvider>{children}</StudioDataProvider>
    </AuthProvider>
  );
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    authService.getStoredSession().then((stored) => {
      setSession(stored);
      setIsHydrated(true);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isHydrated,
      async login(credentials) {
        const nextSession = await authService.login(credentials);
        setSession(nextSession);
      },
      async logout() {
        await authService.logout();
        setSession(null);
      },
    }),
    [isHydrated, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function StudioDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [store, setStore] = useState<StudioStore>(defaultStudioStore);
  const [isStoreLoading, setIsStoreLoading] = useState(true);

  const refreshStore = useCallback(async () => {
    setIsStoreLoading(true);
    try {
      const [publicSiteSettings, publicProjects, featuredProjects, publicPosts, featuredPosts, publicCategories] =
        await Promise.all([
          isAuthenticated ? siteService.getAdminSiteSettings() : siteService.getSiteSettings(),
          isAuthenticated ? projectsService.listAdminProjects() : projectsService.getPublicProjects(),
          projectsService.getFeaturedProjects(),
          isAuthenticated ? postsService.listAdminPosts() : postsService.getPublicPosts(),
          postsService.getFeaturedPosts(),
          isAuthenticated
            ? categoriesService.listAdminCategories()
            : categoriesService.listEnabledCategories(),
        ]);
      setStore((current) => ({
          projects: isAuthenticated
            ? publicProjects
            : [
                ...publicProjects,
                ...featuredProjects.filter(
                  (project) => !publicProjects.some((item) => item.id === project.id),
                ),
              ],
          posts: isAuthenticated
            ? publicPosts
            : [
                ...publicPosts,
                ...featuredPosts.filter(
                  (post) => !publicPosts.some((item) => item.id === post.id),
                ),
              ],
          categories: publicCategories,
          siteSettings: publicSiteSettings,
          uploads: current.uploads,
        }));
    } catch (error) {
      console.warn("Failed to refresh public studio data, using local fallback.", error);
      setStore((current) => ({
        ...defaultStudioStore,
        uploads: current.uploads,
      }));
    } finally {
      setIsStoreLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void refreshStore();
  }, [isHydrated, refreshStore]);

  const value = useMemo<StudioDataContextValue>(
    () => ({
      store,
      isStoreLoading,
      publicProjects: store.projects.filter((project) => project.published),
      featuredProjects: store.projects.filter((project) => project.published && project.featured),
      publicPosts: store.posts.filter((post) => post.status === "published"),
      featuredPosts: store.posts.filter((post) => post.status === "published" && post.featured),
      categories: store.categories.filter((category) => category.enabled),
      async createProject(input) {
        const project = await projectsService.createProject(input);
        await refreshStore();
        return project;
      },
      async updateProject(id, input) {
        const project = await projectsService.updateProject(id, input);
        await refreshStore();
        return project;
      },
      async deleteProject(id) {
        await projectsService.deleteProject(id);
        await refreshStore();
      },
      async createPost(input) {
        const post = await postsService.createPost(input);
        await refreshStore();
        return post;
      },
      async updatePost(id, input) {
        const post = await postsService.updatePost(id, input);
        await refreshStore();
        return post;
      },
      async deletePost(id) {
        await postsService.deletePost(id);
        await refreshStore();
      },
      async createCategory(input) {
        const category = await categoriesService.createCategory(input);
        await refreshStore();
        return category;
      },
      async updateCategory(id, input) {
        const category = await categoriesService.updateCategory(id, input);
        await refreshStore();
        return category;
      },
      async deleteCategory(id) {
        await categoriesService.deleteCategory(id);
        await refreshStore();
      },
      async updateSiteSettings(input) {
        await siteService.updateSiteSettings(input);
        await refreshStore();
      },
      async uploadAsset(file, moduleType = "other") {
        const asset = await uploadsService.uploadAsset(file, moduleType);
        setStore((current) => ({
          ...current,
          uploads: [asset, ...current.uploads],
        }));
        return asset;
      },
      refreshStore,
    }),
    [isStoreLoading, refreshStore, store],
  );

  return <StudioDataContext.Provider value={value}>{children}</StudioDataContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within RootProviders");
  }

  return context;
}

export function useStudioData() {
  const context = useContext(StudioDataContext);

  if (!context) {
    throw new Error("useStudioData must be used within RootProviders");
  }

  return context;
}
