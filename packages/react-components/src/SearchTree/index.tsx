import {Input as SearchInput,Tree} from 'antd';
import type { AntTreeNodeProps, DataNode } from 'antd/es/tree';
import _ from 'lodash';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classes from './index.module.less';
import { RecordMapType, getNodeByTreeData, getNodeByTreeDataForHit, getSumaryData, treePreHandler } from './utils';

export interface InputTreeProps<TreeNode> {
  // treeData，注意一定要有key和title字段
  treeData: TreeNode[];
  // 选择项变化回调：选中的节点数组、keys、当前点击的节点数据
  onChange?: (checkedNodes: TreeNode[], keys: React.Key[], currentNode: TreeNode, expandedKeys: React.Key[]) => void;
  // 统计数据回调
  onSumDataLoaded?:(map: RecordMapType, checkedNodes: TreeNode[])=>void;
  // 受控
  value?: React.Key[];
  // 输入框placeholder
  placeholder?: string;
  // 单选还是多选
  multiple?: boolean;
  // 父子独立模式
  checkStrictly?: boolean;
  // 动态input包围盒样式
  inputContainerClass?: string;
  inputContainerStyle?: React.CSSProperties;
  // 动态tree包围盒样式
  treeContainerClass?: string;
  treeContainerStyle?: React.CSSProperties;
  // 是否虚拟滚动
  virtureHeight?: number;
}

export interface TreeNode extends DataNode {
  title: string | React.ReactNode | ((data: DataNode) => React.ReactNode),
  key: React.Key,
  originName:string,
  isLeaf:boolean,
  children?: TreeNode[],
  parentKeys: React.Key[],
  parentTitles: string[],
  [key: string]: any;
}

function InputTree({
  onChange,
  onSumDataLoaded,
  inputContainerStyle,
  inputContainerClass,
  treeContainerStyle,
  treeContainerClass,
  value,
  treeData,
  multiple = true,
  checkStrictly = false,
  placeholder = '请输入',
  virtureHeight,
}: InputTreeProps<DataNode>) {
  // const [selectNodes, setSelectNodes] = useState<any>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [filterKeys, setFilterKeys] = useState<React.Key[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [virtureTag, setvirtureTag] = useState(true);
  const [rowTreeData, setRowTreeData] = useState<TreeNode[]>([]);
  const [sumData,setSumData] = useState<RecordMapType>({})

  // 获取统计信息
  const sumaryHandler = (checkedNodes:TreeNode[],checkedKeys:React.Key[])=>{
    const sumMap = getSumaryData(checkedNodes,checkedKeys);
    setSumData(sumMap)
    onSumDataLoaded?.(sumMap,checkedNodes)
  }

  // 多选，选中或取消选中tree中节点时，抛出已选中的node列表、key列表、当前点击选中的node数据，设置tree的选中keys
  const onTreeNodeCheck = (
    keys: React.Key[],
    {
      checkedNodes,
      node,
    }: {
      checkedNodes: TreeNode[];
      node: TreeNode;
    },
  ) => {
    if (checkStrictly) {
      // 父子严格模式，keys取值位置不同
      // eslint-disable-next-line no-param-reassign
      keys = (keys as any)?.checked;
    }

    // console.log('触发tree的check事件:', keys, checkedNodes, node);
    setCheckedKeys(keys);
    // 统计数据
    sumaryHandler(checkedNodes,keys)
    // 抛出事件
    if (onChange) {
      onChange(checkedNodes, keys, node, expandedKeys);
    }
  };

  // 单选，选中或取消选中tree中节点时，抛出已选中的node列表、key列表、当前点击选中的node数据，设置tree的选中keys
  const onTreeNodeSelect = (
    keys: React.Key[],
    {
      selectedNodes,
      node,
    }: {
      selectedNodes: TreeNode[];
      node: TreeNode;
    },
  ) => {
    // console.log('触发tree的select事件:', keys, selectedNodes, node);
    setCheckedKeys(keys);
    // 统计数据
    sumaryHandler(selectedNodes,keys)
    // 抛出事件
    if (onChange) {
      onChange(selectedNodes, keys, node, expandedKeys);
    }
  };

  

  // 处理原始treeData，高亮展示搜索字符串
  const filterTreeData = useMemo(() => {
    const loop = (data: TreeNode[], parentTag:boolean): TreeNode[] => data.map((item) => {
      const strTitle = item.title as string;
      const index = strTitle.indexOf(searchStr);
      let display = 'flex';
      // 父级display展示tag
      let tag = parentTag || false;
      if (searchStr) {
        // 有搜索字符串，并且子级或者当前节点名称满足搜索条件，则display展示
        display = filterKeys?.includes(item?.key) ? 'flex' : 'none';
        if (index > -1) {
          // 当前节点命中搜索条件，将所有子级节点不管是否名称命中都展示
          tag = true;
        }
      }
      // 父级节点命中搜索条件，子级节点不管是否名称命中都展示
      if (tag) {
        display = 'flex';
      }

      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchStr.length);
      const title = index > -1 ? (
        <span title={strTitle}>
          {beforeStr}
          <span className="site-tree-search-value">{searchStr}</span>
          {afterStr}
        </span>
      ) : (
        <span>{strTitle}</span>
      );
      if (item.children) {
        return {
          ...item, title, key: item.key, style: { display }, children: loop(item.children, tag),
        };
      }
      // 用style属性，控制树组件的节点的样式属性展示隐藏，实现搜索
      return {
        ...item,
        style: { display },
        title,
        key: item.key,
      };
    });
    return loop(_.cloneDeep(rowTreeData), false);
  }, [filterKeys, rowTreeData]);

  // 输入框回车处理
  const onPressEnter = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 获取该被展开的节点keylist
    const value = e.target.value.trim();
    let res;
    if (value === '') {
      setvirtureTag(true);
      // 空，收起所有展开
      res = {
        nodes:[],
        parentNodesKeys:[]
      }
    } else {
      setvirtureTag(false);
      res = getNodeByTreeDataForHit(value, 'title', _.cloneDeep(rowTreeData));
    }

    // console.log(newExpandedKeys);
    const newExpandedKeys = res.parentNodesKeys;
    setExpandedKeys(newExpandedKeys);
    // 将命中key列表以及其父级key列表设置为FilterKeys，用于更新筛选treeData数据
    const newFilterKeys = new Set([...res?.nodes?.map(item=>item.key), ...newExpandedKeys]);
    setSearchStr(value);
    setFilterKeys([...(newFilterKeys as any)]);
    setAutoExpandParent(true);
  };

  // 外侧tree数据前置处理成组件tree需要的数据
  useEffect(()=>{
    setRowTreeData(treePreHandler(treeData as TreeNode[]))
  },[treeData])

  // 受控处理
  useEffect(() => {
    // 避免onchange抛出，外侧赋值后传入情况下的无效更新
    if (value&&value !== checkedKeys) {
      // 初始化，高亮tree的选中node
      setCheckedKeys(value);
      // 初始化，获取统计信息
      if(value?.length !== 0){
        // 得到最新的原始tree数据，因为上方预处理set异步
        const newTree  = treePreHandler(treeData as TreeNode[])
        const {nodes} = getNodeByTreeData(value, newTree)
        sumaryHandler(nodes, value)
      }
      
      // if (value?.length !== 0) {
      //   // 递归找到选中节点，及需要展开的父节点key列表，初始化展开
      //   const res = getNodeByTreeData(value, _.cloneDeep(newTree));
      //   // setSelectNodes(res.nodes);
      //   setExpandedKeys(res.parentNodesKeys);
      // }
    }
  }, [value]);

  // 控制展开
  const onTreeNodeExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  // 自定义展开折叠图标
  const switcherIcon = useCallback((props: AntTreeNodeProps) => {
    const { expanded } = props;

    if (expanded) {
      return <span className={classes['icon-receipts']} />;
    }

    return <span className={classes['icon-expand']} />;
  }, []);
  // 树节点图标;
  const renderTreeIcon = useCallback((props: any) => {
    const { isLeaf, data } = props;

    if (isLeaf || !data.children) {
      return <span className={classes['custom-leaf-icon']} />;
    }

    return null;
  }, []);
  const treeRender = () => {
    let element;
    const virtureObj:any = {};
    if (virtureHeight && virtureTag) {
      virtureObj.height = virtureHeight;
    }

    if (rowTreeData.length > 0) {
      if (multiple) {
        element = (
          <Tree
            blockNode
            switcherIcon={switcherIcon}
            checkable={multiple}
            multiple={multiple}
            checkStrictly={checkStrictly}
            selectable={false}
            treeData={filterTreeData}
            onCheck={onTreeNodeCheck}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={onTreeNodeExpand}
            className={classes['tree-container']}
            {...virtureObj}
          />
        );
      } else {
        element = (
          <Tree
            blockNode
            showIcon
            switcherIcon={switcherIcon}
            icon={renderTreeIcon}
            treeData={filterTreeData}
            onSelect={onTreeNodeSelect}
            selectedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={onTreeNodeExpand}
            className={classes['tree-container-single']}
            {...virtureObj}
          />
        );
      }
    } else {
      element = <div style={{ textAlign: 'center' }}>暂无数据</div>;
    }

    return element;
  };

  return (
    <div className={classes.container}>
      <div className={inputContainerClass} style={inputContainerStyle}>
        <SearchInput onPressEnter={onPressEnter as any} placeholder={placeholder} />
      </div>
      <div className={treeContainerClass} style={treeContainerStyle}>
        {treeRender()}
      </div>
    </div>
  );
}

export default InputTree;
