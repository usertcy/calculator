class Calculator {




   
    constructor() {
        this.reset();
    }




    reset() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = '';
        this.newValue = false;
        this.hasDecimal = false;
    }




    // 类型是字符串：因为从HTML的 data-value 属性获取的都是字符串
    addDigit(digit) {
        // 刚开始为0，或者继续输入数字
        if (this.newValue === false) {
            if (this.currentValue === '0') {
                this.currentValue = digit;
            }
            else {
                this.currentValue += digit;
            }
        }
        // 刚按了运算符（+、-、×、÷）等号（=）清除（AC）
        else {
            this.currentValue = digit;
            this.newValue = false;
            this.hasDecimal = false;
        }
    }




    addDecimal() {
        // 刚按了运算符（+、-、×、÷）（=）（AC）之后
        if (this.newValue) {
            this.currentValue = '0.';
            this.newValue = false;
            this.hasDecimal = true;
        }
        // 当前没有小数点
        else if (!this.hasDecimal) {
            this.currentValue += '.';
            this.hasDecimal = true;
        }
    }



    // 中间过程的计算（5+8）*9
    setOperator(newOperator) {
        if (this.operator && !this.newValue) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = newOperator;
        this.newValue = true;
        this.hasDecimal = false;
    }




    calculate() {
        if (!this.operator || this.newValue) return;

        // parseFloat内置函数把字符串转换为浮点数
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operator) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentValue = '错误';
                    this.operator = '';
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // 处理浮点数精度
        result = Math.round(result * 100000000) / 100000000;
        // toString()内置方法
        this.currentValue = result.toString();
        this.operator = '';
        // 开始新的计算
        this.newValue = true;
    }




    // 百分比计算
    percentage() {
        //  parseFloa把字符串转为浮点数
        const value = parseFloat(this.currentValue);
        this.currentValue = (value / 100).toString();
    }



    // 切换正负号
    toggleSign() {
        if (this.currentValue !== '0') {
            this.currentValue = this.currentValue.startsWith('-') ? this.currentValue.slice(1) : '-' + this.currentValue;
        }
    }




    // 退格
    backspace() {
        if (this.currentValue.length > 1) {
            if (this.currentValue[this.currentValue.length - 1] === '.') {
                this.hasDecimal = false;
            }
            this.currentValue = this.currentValue.slice(0, -1);
        } 
        else {
            this.currentValue = '0';
        }
    }



    // 获取显示值
    getDisplayValue() {
        return this.currentValue;
    }
}





// 创建计算器实例
const calc = new Calculator();




// DOM 元素
const display = document.getElementById('display');




// 更新显示
function updateDisplay() {
    display.textContent = calc.getDisplayValue();
}





// 鼠标点击按钮处理
function handleButtonClick(event) {
    // event.target：触发事件的DOM元素，点击7返回<button class="btn number" data-value="7">7</button>
    const button = event.target;


    // 数字按钮
    if (button.classList.contains('number')) {
        // .dataset 是 DOM 元素的属性，用于访问 HTML 中的 data-* 自定义属性。
        const value = button.dataset.value;
        if (value === '.') {
            calc.addDecimal();
        } 
        else {
            calc.addDigit(value);
        }
        updateDisplay();
        return;
    }


    // 运算符按钮
    if (button.classList.contains('operator')) {
        const action = button.dataset.action;

        switch (action) {
            case 'clear':
                calc.reset();
                break;
            case 'backspace':
                calc.backspace();
                break;
            case 'toggle-sign':
                calc.toggleSign();
                break;
            case 'percentage':
                calc.percentage();
                break;
            case 'equals':
                calc.calculate();
                break;
            default:
                calc.setOperator(action);
                break;
        }

        updateDisplay();
    }
}







// 键盘点击
function handleKeyboardInput(event) {
    const key = event.key;

    // 数字和小数点
    if (key >= '0' && key <= '9') {
        calc.addDigit(key);
    } else if (key === '.') {
        calc.addDecimal();
    }

    // 运算符
    else if (key === '+') {
        calc.setOperator('add');
    } else if (key === '-') {
        calc.setOperator('subtract');
    } else if (key === '*') {
        calc.setOperator('multiply');
    } else if (key === '/') {
        event.preventDefault(); // 阻止浏览器默认的菜单
        calc.setOperator('divide');
    }

    // 功能键
    else if (key === 'Enter' || key === '=') {
        calc.calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        calc.reset();
    } else if (key === 'Backspace') {
        calc.backspace();
    } else if (key === '%') {
        calc.percentage();
    }

    updateDisplay();
}







// 添加按钮动画效果
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // 按下时，按钮缩小
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}







function initCalculator() {
    // 返回所有按键元素
    const buttonsContainer = document.querySelector('.buttons');
    // 点击了按钮跳转 handleButtonClick（）
    buttonsContainer.addEventListener('click', handleButtonClick);
    // 添加键盘事件，方便键盘操作不用鼠标点击
    document.addEventListener('keydown', handleKeyboardInput);

    // 添加按钮效果
    addButtonEffects();

    updateDisplay();
}





//第一步： 页面加载完成后跳转到initCalculator（）
document.addEventListener('DOMContentLoaded', initCalculator);






function addExtraStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            transition: all 0.1s ease;
            user-select: none;
        }
        
        .btn:active {
            transform: scale(0.95);
        }
        
        .operator:active {
            background-color: #d6890f !important;
        }
        
        .number:active {
            background-color: #d4d4d4 !important;
        }
        
        .display {
            transition: color 0.2s ease;
        }
    `;
    // 将样式元素插入到页面的 <head> 中
    document.head.appendChild(style);
}






addExtraStyles();