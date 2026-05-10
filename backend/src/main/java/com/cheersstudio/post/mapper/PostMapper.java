package com.cheersstudio.post.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cheersstudio.post.entity.PostEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper extends BaseMapper<PostEntity> {}
