/**
 * 阿里云 OSS 视频配置
 * 用于将课程模块与 OSS 桶内视频文件对应
 *
 * 使用方式：
 * 1. 在 OSS_VIDEO_MAP 中按「课程ID:模块索引」添加映射
 * 2. 或直接在各课程的 embedUrl 中写入完整 OSS URL（以 .mp4 结尾）
 *
 * OSS 桶地址：https://jared-jiang.oss-cn-beijing.aliyuncs.com
 */

export const OSS_VIDEO_BASE = 'https://jared-jiang.oss-cn-beijing.aliyuncs.com'

/**
 * 根据 OSS 对象路径生成可访问的完整 URL（自动处理中文等特殊字符编码）
 * @param {string} objectKey - OSS 对象键，如 "20250915_AI测算餐饮热卡和营养成分需求分析(1).mp4"
 * @returns {string} 完整 URL
 */
export function ossVideoUrl(objectKey) {
  if (!objectKey) return ''
  const encoded = objectKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
  return `${OSS_VIDEO_BASE}/${encoded}`
}

/**
 * 课程视频与 OSS 文件映射
 * key: "courseId:moduleIndex"，value: OSS 对象键
 *
 * 示例：添加新视频时，在此增加一行
 * '17:0': '20250915_AI测算餐饮热卡和营养成分需求分析(1).mp4',
 */
export const OSS_VIDEO_MAP = {
  '17:0': '20250915_AI测算餐饮热卡和营养成分需求分析.mp4',
  '18:0': '20250524_什么是长寿诊所，提供哪些服务，用户体验感.mp4',
  '19:0': '20250509 Phil Newman长寿科技最新发展趋势video1225451144.mp4',
  '20:0': '20250125_Yuta Lee_干细胞与外泌体疗法促进长寿.mp4',
  '21:0': '20251229_长寿医学系列讲座一——甲基化检测衰老进程(1).mp4',
  '22:0': '20250315_长寿医学讲座——脑光疗法可穿戴设备.mp4',
  '23:0': '20251019_长寿诊所检测方法交流.mp4',
  '24:0': '20251227 20-00-28.mp4',
  '25:0': '20260118 08-58-08.mp4',
  '26:0': '20250531_AYUN Walk-in Longevity Clinic model.mp4',
  '27:0': '20250517_XPRIZE长寿科技获奖项目讲解.mp4',
  '28:0': '20250405_新加坡模式二——社区医生长寿诊所的经验和教训.mp4',
  // 后续可在此添加更多映射，例如：
  // '1:0': 'videos/长寿饮食概述.mp4',
  // '2:1': 'videos/16-8实操指南.mp4',
}
