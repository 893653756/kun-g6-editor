/**
 * 一些辅助功能
 */
export function getMenuList(item) {
  const lockMenu = isLock(item);
  const highlightMenu = isHighlight(item);
  const emphasizeMenu = isEmphasize(item);
  // 扩展一层
  const extendMenu = `<div data-type="extend-relation" class="kf-icon-full-screen">
                    <span>扩展一层</span>
                  </div>`;
  // 删除
  const deleteMenu = `<div data-type="delete" class="kf-icon-delete">
                        <span>删除</span>
                      </div>`;
  return `<div class="right-menu__list">
    ${extendMenu}
    ${lockMenu}
    ${highlightMenu}
    ${emphasizeMenu}
    ${deleteMenu}
  </div>`
};

/**
 * 是否锁定
 * @param { Object } item 节点对象
 * @returns { String }
 */
function isLock(item) {
  const lock = item.hasLocked();
  const str = `<div data-type="lock-${lock}" class="el-icon-lock">
                <span>${lock ? '解锁' : '锁定'}</span>
              </div>`;
  return str;
};

/**
 * 是否高亮
 */
function isHighlight(item) {
  const selected = item.hasState('selected');
  const str = `<div data-type="highlight-${selected}" class="el-icon-sunny">
                <span>${selected ? '取消高亮' : '高亮'}</span>
              </div>`;
  return str;
};

/**
 * 是否强调
 */
function isEmphasize(item) {
  const model = item.get('model');
  const emphasize = model.emphasize;
  const str = `<div data-type="emphasize-${emphasize}" class="kf-icon-info">
                <span>${emphasize ? '取消强调' : '强调'}</span>
              </div>`;
  return str;
}