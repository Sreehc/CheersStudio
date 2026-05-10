package com.cheersstudio.site.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cheersstudio.common.model.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("site_settings")
@EqualsAndHashCode(callSuper = true)
public class SiteSettingsEntity extends BaseEntity {

  @TableId private Long id;
  private String siteName;
  private String heroTitle;
  private String heroDescription;
  private String locationText;
  private String contactEmail;
  private String aboutIntro;
  private String heroStatsJson;
  private String introBlocksJson;
  private String ctaJson;
  private String socialLinksJson;
  private String contactLinksJson;
  private String contactFormJson;
  private String navbarSubtitle;
  private String footerDescription;
  private String aboutDirectionsJson;
  private String aboutFocusesJson;
  private String aboutWorkflowJson;
  private String aboutValuesJson;
}
