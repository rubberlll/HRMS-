1. 接口
   interface User {
   name: string;
   age: number;
   }

可使用 extends 继承

interface Admin extends User {
role: string;
} 2.类型
type User = {
name: string;
age: number;
}
与 interface 的区别

interface 可以重复声明自动合并 而 type 不可以

interface 可以继承 而 type 可以交叉类型&

// Type 使用交叉类型 &
type Animal = {
name: string;
};

type Dog = Animal & {
breed: string;
};

type 可以定义 联合类型 元组等
