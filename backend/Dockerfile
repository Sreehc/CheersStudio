# syntax=docker/dockerfile:1.7
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q -Dmaven.wagon.http.retryHandler.count=5 dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q -DskipTests -Dmaven.wagon.http.retryHandler.count=5 package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

ENV TZ=Asia/Shanghai
ENV JAVA_OPTS=""

COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080

CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
