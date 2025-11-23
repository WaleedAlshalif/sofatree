import { NODE_TYPES } from '../types/index.js';

// إنشاء معرف فريد للعقدة
const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// تحويل مسار المجلد إلى هيكل شجرة
export const parseFolderPath = (folderPath) => {
    try {
        // تنظيف المسار وإزالة الشرطات المزدوجة
        const cleanPath = folderPath.replace(/[\\/]+/g, '/').replace(/^[/]+|[/]+$/g, '');

        if (!cleanPath) {
            throw new Error('Folder path cannot be empty');
        }

        // تقسيم المسار إلى أجزاء
        const pathParts = cleanPath.split('/').filter(part => part.trim() !== '');

        if (pathParts.length === 0) {
            throw new Error('Invalid folder path');
        }

        // بناء الشجرة من المسار
        let currentTree = null;

        pathParts.forEach((part, index) => {
            const isLast = index === pathParts.length - 1;
            const nodePath = pathParts.slice(0, index + 1).join('/');

            const newNode = {
                id: generateId(),
                name: part,
                type: isLast ? NODE_TYPES.FOLDER : NODE_TYPES.FOLDER,
                path: nodePath,
                isExpanded: false,
                children: isLast ? [] : []
            };

            if (!currentTree) {
                currentTree = newNode;
            } else {
                currentTree.children.push(newNode);
                currentTree = newNode;
            }
        });

        // العودة للجذر وبناء الشجرة الكاملة
        return buildTreeFromPath(pathParts);

    } catch (error) {
        throw new Error(`Failed to parse folder path: ${error.message}`);
    }
};

// بناء الشجرة من أجزاء المسار
const buildTreeFromPath = (pathParts) => {
    const root = {
        id: generateId(),
        name: pathParts[0],
        type: NODE_TYPES.FOLDER,
        path: pathParts[0],
        isExpanded: true,
        children: []
    };

    let current = root;

    for (let i = 1; i < pathParts.length; i++) {
        const newNode = {
            id: generateId(),
            name: pathParts[i],
            type: NODE_TYPES.FOLDER,
            path: pathParts.slice(0, i + 1).join('/'),
            isExpanded: i === pathParts.length - 1,
            children: i === pathParts.length - 1 ? [] : []
        };

        current.children.push(newNode);
        current = newNode;
    }

    return root;
};

// تحويل JSON إلى هيكل شجرة
export const parseJsonInput = (jsonInput) => {
    try {
        const parsedData = JSON.parse(jsonInput);

        if (!parsedData) {
            throw new Error('JSON cannot be empty');
        }

        // تحويل البيانات إلى هيكل شجرة قياسي
        return convertToTreeStructure(parsedData);

    } catch (error) {
        throw new Error(`Invalid JSON structure: ${error.message}`);
    }
};

// تحويل أي هيكل JSON إلى هيكل شجرة قياسي
const convertToTreeStructure = (data, parentPath = '') => {
    if (typeof data !== 'object' || data === null) {
        throw new Error('JSON must be an object');
    }

    const currentNode = {
        id: generateId(),
        name: data.name || 'root',
        type: data.type || (data.children ? NODE_TYPES.FOLDER : NODE_TYPES.FILE),
        path: parentPath ? `${parentPath}/${data.name || 'root'}` : (data.name || 'root'),
        isExpanded: true
    };

    // إذا كان مجلداً وأطفاله موجودين
    if (data.children && Array.isArray(data.children)) {
        currentNode.children = data.children.map((child, index) =>
            convertToTreeStructure(child, currentNode.path)
        );
    } else if (currentNode.type === NODE_TYPES.FOLDER) {
        currentNode.children = [];
    }

    return currentNode;
};

// معالج الإدخال الرئيسي
export const parseInput = (inputType, inputValue) => {
    try {
        if (inputType === 'json') {
            return {
                tree: parseJsonInput(inputValue),
                error: null
            };
        } else if (inputType === 'folderPath') {
            return {
                tree: parseFolderPath(inputValue),
                error: null
            };
        } else {
            throw new Error('Invalid input type');
        }
    } catch (error) {
        return {
            tree: null,
            error: error.message
        };
    }
};