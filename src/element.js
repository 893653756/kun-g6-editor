import Vue from 'vue';
import {
  Dialog,
  Menu,
  Submenu,
  Form,
  FormItem,
  Button,
  Table,
  TableColumn,
  Input,
  Radio,
  RadioGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Select,
  Option,
  Message,
  Loading,
  MessageBox,
  Tooltip
} from 'element-ui';

const elementComp = [
  Dialog,
  Menu,
  Submenu,
  Form,
  FormItem,
  Button,
  Table,
  TableColumn,
  Input,
  Radio,
  RadioGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Select,
  Option,
  Tooltip,
];
// 注册组件
elementComp.forEach(v => {
  Vue.use(v);
});
Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$loading = Loading.service;
