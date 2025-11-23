// دوال مساعدة لتحسين UX
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateTreeData = (treeData) => {
    if (!treeData) return { isValid: false, error: 'No tree data provided' };

    const requiredFields = ['id', 'name', 'type'];
    const missingFields = requiredFields.filter(field => !treeData[field]);

    if (missingFields.length > 0) {
        return {
            isValid: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
        };
    }

    if (!['folder', 'file'].includes(treeData.type)) {
        return {
            isValid: false,
            error: 'Invalid node type. Must be "folder" or "file"'
        };
    }

    return { isValid: true, error: null };
};

export const generateSampleData = (type = 'json') => {
    if (type === 'json') {
        return JSON.stringify({
            name: "MyProject",
            type: "folder",
            children: [{
                    name: "src",
                    type: "folder",
                    children: [
                        { name: "App.js", type: "file" },
                        { name: "index.js", type: "file" }
                    ]
                },
                {
                    name: "public",
                    type: "folder",
                    children: [
                        { name: "index.html", type: "file" },
                        { name: "favicon.ico", type: "file" }
                    ]
                },
                { name: "package.json", type: "file" },
                { name: "README.md", type: "file" }
            ]
        }, null, 2);
    }

    return "C:/Users/Username/MyProject/src/components/utils";
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};