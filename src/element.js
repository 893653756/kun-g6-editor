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
  Message
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

Vue.prototype.$message = Message;