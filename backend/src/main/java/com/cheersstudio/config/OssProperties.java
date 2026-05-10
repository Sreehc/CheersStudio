package com.cheersstudio.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "aliyun.oss")
public class OssProperties {

  private Boolean enabled;
  private String endpoint;
  private String region;
  private String bucketName;
  private String accessKeyId;
  private String accessKeySecret;
  private String objectPrefix;
  private String publicUrlPrefix;

  public String getBucket() {
    return bucketName;
  }

  public String getDomain() {
    if (publicUrlPrefix != null && !publicUrlPrefix.isBlank()) {
      return publicUrlPrefix;
    }
    return "https://" + bucketName + "." + endpoint;
  }
}
