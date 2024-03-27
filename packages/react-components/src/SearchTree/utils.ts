import { DataNode } from "antd/es/tree";
import { TreeNode } from ".";
import _ from 'lodash';

export interface RecordType extends TreeNode{
  childCheckedKeys: React.Key[];
  childCheckedLeafKeys:React.Key[];
}
export interface RecordMapType {
  [key: string]: RecordType;
}

// 将antd的原始tree处理成工具tree，统计各节点的父信息
export const treePreHandler = (tree: DataNode[])=>{
  const newTree: TreeNode[]  = _.cloneDeep(tree);
  const loop = (node: TreeNode,parentKeys:React.Key[],parentTitles:string[])=>{
    // 保持原生的纯文字的title而不是处理成ReactDom后的title
    node.originName = node.title as string
    node.parentKeys = [...parentKeys]
    node.parentTitles = [...parentTitles]
    if(node?.children&&node.children.length>0){
      node.isLeaf=false
      node.children.forEach((item)=>{
        loop(item,parentKeys.concat(node.key),parentTitles.concat((node as any).title))
      })
    }else{
      node.isLeaf=true
    }
  }
  newTree.forEach(item=>loop(item,[],[]))
  return newTree
}

// 通过TreeData找到指定keys的nodes以及需要展开的父节点key列表
export const getNodeByTreeData = (keys: React.Key[], tree: TreeNode[]) => {
  const nodes: TreeNode[] = [];
  const parentNodesKeys: React.Key[][] = [];
  // 递归
  function filterNode(list: TreeNode[], parentKeys: React.Key[]) {
    list.forEach((item: TreeNode) => {
      // 是选中的节点，将父节点列表保存
      if (keys.includes(item.key)) {
        nodes.push(item);
        if (parentKeys.length > 0) {
          parentNodesKeys.push([...parentKeys]);
        }
      }

      // 含有子项，递归子项，将子项选中节点的父节点找出来
      if (item.children) {
        filterNode(item.children, parentKeys.concat(item.key));
      }
    });
  }

  filterNode(tree, []);

  // 去重
  function parentsSetHandler() {
    const res: React.Key[] = [];
    const resSet = new Set<React.Key>();
    parentNodesKeys.forEach((item) => {
      item.forEach((innerItem) => {
        resSet.add(innerItem);
      });
    });
    resSet.forEach((item) => {
      res.push(item);
    });
    return res;
  }

  return { nodes, parentNodesKeys: parentsSetHandler() };
};

// 在treeData中，找到节点的属性中hitFieldName字段名的值含有hitStr字符串的节点的nodelist及父节点keylist
export const getNodeByTreeDataForHit = (hitStr: string, hitFieldName: string, tree: TreeNode[]) => {
  const nodes: TreeNode[] = [];
  const parentNodesKeys: React.Key[][] = [];
  // 递归
  function filterNode(list: TreeNode[], parentKeys: React.Key[]) {
    list.forEach((item: TreeNode) => {
      // 是命中的节点，将父节点列表保存
      if (item[hitFieldName].indexOf(hitStr) > -1) {
        nodes.push(item);
        if (parentKeys.length > 0) {
          parentNodesKeys.push([...parentKeys]);
        }
      }

      // 含有子项，递归子项，将子项命中节点的父节点找出来
      if (item.children) {
        filterNode(item.children, parentKeys.concat(item.key));

      }
    });
  }

  filterNode(tree,[]);

  // 去重
  function parentsSetHandler() {
    const res: React.Key[] = [];
    const resSet = new Set<React.Key>();
    parentNodesKeys.forEach((item) => {
      item.forEach((innerItem) => {
        resSet.add(innerItem);
      });
    });
    resSet.forEach((item) => {
      res.push(item);
    });
    return res;
  }

  return { nodes, parentNodesKeys: parentsSetHandler() };
};

// 根据TreeNode[]类型（存在parent数据）已选择节点数据和已选择key数据checkedKeys，得到筛选后的节点数据专用于统计
export const getSumaryData = (checkedNodes: TreeNode[],checkedKeys:React.Key[])=>{
  const sumKeys =  new Set<React.Key>(checkedKeys)
  
  // 过滤checkedKeys中父节点在选中节点中的key
  checkedNodes.forEach((node:TreeNode)=>{
    node?.parentKeys?.forEach(item_pk=>{
      if(checkedKeys.includes(item_pk)){
        // 父节点在已选节点中
        sumKeys.delete(node.key)
      }
    })
  })
  // 过滤节点
  const sumNodes = checkedNodes.filter(node=>[...(sumKeys as any)].includes(node.key))
  // 记录map
  const recordMap:RecordMapType = {}
  sumNodes.forEach(node=>{
    if(!recordMap.hasOwnProperty((node as any)?.key)){
      // 将node存入，加入新数据childCheckedKeys、childCheckedKeys存放勾选的子节点key、叶子节点key，用于删除等操作
      const temp = {...node,childCheckedKeys:[],childCheckedLeafKeys:[]}
      recordMap[(node as any)?.key] = temp
    }
  })
  // 给记录map注入选择key
  const injectHandler =(mapKey:React.Key,node:TreeNode)=>{
    if(recordMap.hasOwnProperty(mapKey as string)){
      // 注入选择key
      recordMap[mapKey as any].childCheckedKeys.push(node.key)
      if(node.isLeaf){
        // 注入选择叶子key
        recordMap[mapKey  as any].childCheckedLeafKeys.push(node.key)
      }
    }
  }
  checkedNodes.forEach(node=>{
    node.parentKeys?.forEach(pk=>{
      injectHandler(pk,node)
    })
    // 叶子节点本身注入
    if(node.isLeaf){
      injectHandler(node.key,node)
    }
  })

  
  return recordMap
}

// 根据典型tree数据和checkedKeys，得到筛选后的节点数据专用于统计
// export const getS