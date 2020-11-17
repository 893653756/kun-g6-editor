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
];
// 注册组件
elementComp.forEach(v => {
  Vue.use(v);
});
Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;