#  SofaTree - Interactive Folder Tree Visualization

A beautiful and interactive React application for visualizing folder structures as tree diagrams.

##  Features

- **Dual Input Methods**: JSON input or folder path parsing
- **Interactive Tree Visualization**: Both hierarchical and SVG views
- **Zoom & Pan**: Smooth navigation for large trees
- **Tooltips**: Rich information on hover
- **Export Capability**: Save your tree structures as JSON
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Automatically saves your work

##  Quick Start

1. **Choose Input Type**:
   - **JSON**: Paste your folder structure as JSON
   - **Folder Path**: Enter a path like `C:/Users/Name/Documents`

2. **Generate Tree**: Click "Generate Tree" to create the visualization

3. **Interact**:
   - Click folders to expand/collapse
   - Hover for detailed information
   - Use zoom and pan in SVG view
   - Switch between hierarchy and interactive views

##  Input Formats

### JSON Format
```json
{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "documents",
      "type": "folder",
      "children": [
        {"name": "file.txt", "type": "file"}
      ]
    }
  ]
}