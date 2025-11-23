// أنواع بيانات العقدة في الشجرة
export const NODE_TYPES = {
    FOLDER: 'folder',
    FILE: 'file'
};

// هيكل العقدة
/**
 * @typedef {Object} TreeNode
 * @property {string} id - المعرف الفريد
 * @property {string} name - اسم العقدة
 * @property {string} type - نوع العقدة (folder/file)
 * @property {TreeNode[]} [children] - العقد الفرعية (للمجلدات فقط)
 * @property {string} [path] - المسار الكامل
 * @property {boolean} [isExpanded] - هل العقدة موسوعة؟
 */

/**
 * @typedef {Object} ParsingResult
 * @property {TreeNode} tree - هيكل الشجرة
 * @property {Error|null} error - خطأ إذا وجد
 */