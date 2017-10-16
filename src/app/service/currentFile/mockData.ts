// 验证基类
export class AUTH {

    private username: string;
    private pwd: string;
    private auth = false;
    private mockData = [{ username: 'guzhang', pwd: '1' }];

    constructor(name: string, password: string) {
        this.username = name;
        this.pwd = password;
    }

    // 检查用户账号密码
    public checkUser() {
        for (let i = 0; i < this.mockData.length; i++) {
            if (this.mockData[i].username === this.username && this.mockData[i].pwd === this.pwd) {
                this.auth = true
            }
        }
    }

    // 返回是否通过验证
    public isAuth(): boolean {
        return this.auth;
    }
}

