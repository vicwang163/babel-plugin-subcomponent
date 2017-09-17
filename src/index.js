'use strict';
/*
author: vic.wang
*/
//根据正则，替换引用内容
function changeSubComponent(obj,item){
  let keys = Object.keys(obj);
  var reg,result=null;
  for(let i=0,len=keys.length;i<len;i++){
    reg = new RegExp(keys[i]);
    if( reg.test(item) ){
      result = item.replace(reg,obj[keys[i]]);
      break;
    }
  }
  return result;
}

module.exports = function(babel) {
    var t = babel.types; // AST模块
    return {
      visitor:{
        ImportDeclaration( node, state ){
          let opts = state.opts;
          let keys = Object.keys(opts);
          //是否需要转换
          let items = [],component = node.node.source.value;
          if( keys.indexOf(component) == -1 ){
            return;
          }
          
          let needTransform = node.node.specifiers.every(function(item){
            if( item.type != 'ImportDefaultSpecifier' ){
              items.push( item.imported.name );
              return true;
            }else{
              return false;
            }
          })
          
          if( !needTransform ){
            return;
          }
          
          //generate result
          let results = items.map(function(item){
            let subContent = changeSubComponent(opts[component],item);
            if( !subContent ){
              throw path.buildCodeFrameError("Error message here");
            }
            let identifier = t.identifier(item)
            let importDefaultSpecifier = t.importDefaultSpecifier(identifier);
            let importDeclaration = t.importDeclaration([importDefaultSpecifier],t.stringLiteral(component+'/'+subContent));
            return importDeclaration;
          })
          
          node.replaceWithMultiple(results)
        }
      }
    }
};