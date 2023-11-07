class NestedSet {
  nodes: Record<string, { id: string; parent: string; children: string[] }> =
    {};

  addNode(key: string, parentKey: string | null = null, id: string) {
    this.nodes[key] = { parent: parentKey, children: [], id: id };

    if (parentKey !== null) {
      if (!this.nodes[parentKey]) {
        this.nodes[parentKey] = { parent: null, children: [], id };
      }
      this.nodes[parentKey].children.push(key);
    }
  }

  getParent(key: string): string | null {
    return this.nodes[key]?.parent || null;
  }

  getChildren(key: string): string[] {
    return this.nodes[key]?.children || [];
  }

  getAllNodes(): {
    [key: string]: { parent: string | null; children: string[] };
  } {
    return this.nodes;
  }

  getAllParents(key: string): string[] {
    const parents: string[] = [];
    let currentKey = key;
    while (this.nodes[currentKey]?.parent !== null) {
      const parent = this.nodes[currentKey].parent as string;

      parents.push(parent);

      currentKey = parent;
    }
    return parents;
  }

  getAllChildren(key: string): string[] {
    const children: string[] = [];

    const traverse = (nodeKey: string) => {
      const currentChildren = this.getChildren(nodeKey);
      for (const child of currentChildren) {
        children.push(child);
        traverse(child);
      }
    };

    traverse(key);
    return children;
  }
}

const nestedSet = new NestedSet();

export default nestedSet;

// Usage
// const nestedSet = new NestedSet();

// nestedSet.addNode("zone-a");
// nestedSet.addNode("zone-b");
// nestedSet.addNode("aisle-1", "zone-a");
// nestedSet.addNode("aisle-2", "zone-a");
// nestedSet.addNode("aisle-3", "zone-b");
// nestedSet.addNode("aisle-4", "zone-b");
// nestedSet.addNode("rack-1", "aisle-1");
// nestedSet.addNode("rack-2", "aisle-2");
// nestedSet.addNode("bin-1", "rack-1");
// nestedSet.addNode("bin-2", "rack-1");
// nestedSet.addNode("bin-3", "rack-1");
// nestedSet.addNode("bin-4", "rack-2");
// nestedSet.addNode("bin-5", "rack-2");
// nestedSet.addNode("bin-6", "rack-2");

// console.log("All Parents bin-4:", nestedSet.getAllParents("bin-4"));
// console.log("All Children of rack-1:", nestedSet.getAllChildren("rack-1"));
