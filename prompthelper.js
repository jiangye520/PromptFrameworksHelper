// ==UserScript==
// @name         ChatGPT 框架助手
// @namespace    http://tampermonkey.net/
// @version      1.0.20240308192414
// @description  在ChatGPT页面侧边显示框架助手
// @author       iaiuse.com
// @match        https://chat.openai.com/*
// @match        https://claude.ai/chat/*
// @match        https://aistudio.google.com/*
// @match        https://chatglm.cn/main/*
// @match        https://kimi.moonshot.cn/*
// @match        https://gemini.google.com/*
// @icon         https://www.iaiuse.com/img/avatar.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    // 动态添加Tailwind CSS
    const tailwindLink = document.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(tailwindLink);
    // 动态添加Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(faLink);
    //const tailwind_css = GM_getResourceText('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    //GM_addStyle(tailwind_css);

    // 添加侧边栏样式
    GM_addStyle(`
        #frameHelper {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background-color: #f9f9f9;
            width: 50px; /* Initial width */
            height: auto;
            transition: width 0.5s;
            overflow: hidden;
            z-index: 1000;
            padding: 10px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
            border-radius: 5px 0 0 5px;
            cursor: pointer;
        }

        #frameHelper.expanded {
            width: 600px; /* Expanded width */
        }

        .frame-content, .dynamic-content {
            display: none;
        }

        #frameHelper.expanded .frame-content,
        #frameHelper.expanded .dynamic-content {
            display: block;
        }
        .top-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .select-container, .icon-container {
            padding: 5px;
        }

        .icon-container i {
            cursor: pointer;
        }
        .arrow{
              position: relative;
              display: inline-block;
              padding-left: 20px;
            }

            .arrow::before{
              content: '';
              width: 6px;
              height: 6px;
              border: 0px;
              border-top: solid 2px #5bc0de;
              border-right: solid 2px #5bc0de;
              -ms-transform: rotate(45deg);
              -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
              position: absolute;
              top: 50%;
              left: 0;
              margin-top: -4px;
            }
    `);

    // 创建侧边栏元素
    const frameHelper = document.createElement('div');
    frameHelper.id = 'frameHelper';
    frameHelper.className = 'bg-gray-100 text-gray-800 p-1 rounded-lg shadow transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-200';
    document.body.appendChild(frameHelper);

    // 创建顶部容器，用于放置select和图标
    const topContainer = document.createElement('div');
    topContainer.className = 'top-container flex justify-between items-center mb-1'; //'frame-content flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow';
    frameHelper.appendChild(topContainer);

    // 创建并配置select容器
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';
    // 创建select元素
    const selectElement = document.createElement('select');
    selectElement.className = 'flex-grow';
    // 添加选项到select...
    selectElement.addEventListener('change', function() {
        if('-请选择-' == this.value )
            return false;
        loadFrameworkData(this.value);
    });
    selectContainer.appendChild(selectElement);

    // 创建并配置图标容器
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container flex-shrink-0 ml-1 arrow';
    iconContainer.addEventListener('click', function() {
        // 切换侧边栏大小的逻辑
        const frameHelper = document.getElementById('frameHelper');
        frameHelper.classList.toggle('expanded');
    });
    // 创建缩放图标
    // 使用Font Awesome图标
    const shrinkIcon = document.createElement('i');
    shrinkIcon.className = 'fas fa-angle-double-right text-gray-600 hover:text-gray-800 cursor-pointer';
    shrinkIcon.style.fontSize = '1.25rem';
    shrinkIcon.style.fontSize = '20px'; // 调整图标大小

    iconContainer.appendChild(shrinkIcon);

    // START FRAMEWORKS
var frameworks = [
  {
    "APE": {
      "name": "APE框架",
      "author": "不详",
      "description": "简单粗暴",
      "fields": [
        {
          "ACTION": {
            "text": "定义要完成的工作或活动"
          }
        },
        {
          "PURPOSE": {
            "text": "讨论意图或目标"
          }
        },
        {
          "EXPECTATION": {
            "text": "陈述预期的结果"
          }
        }
      ]
    }
  },
  {
    "BROKE": {
      "name": "BROKE框架",
      "author": "陈财猫",
      "description": "通过全局思维，整体框架来理解要解决的问题",
      "fields": [
        {
          "Background": {
            "text": "说明背景，为 ChatGPT 提供充足信息"
          }
        },
        {
          "Role": {
            "text": "我希望ChatGPT扮演的角色"
          }
        },
        {
          "Objectives": {
            "text": "我们希望实现什么"
          }
        },
        {
          "KeyResult": {
            "text": "我要什么具体效果试验并调整"
          }
        },
        {
          "Evolve": {
            "text": "试验并改进"
          }
        }
      ]
    }
  },
  {
    "CRISPE": {
      "name": "CRISPE框架",
      "author": "Matt Nigh",
      "description": "非常适用于根据特定指令和相关背景信息生成输出的领域",
      "fields": [
        {
          "CapacityandRole": {
            "text": "ChatGPT 应扮演什么角色"
          }
        },
        {
          "Insight": {
            "text": "提供你请求的背后见解、背景和上下文"
          }
        },
        {
          "Statement": {
            "text": "你要求 ChatGPT 做什么"
          }
        },
        {
          "Personality": {
            "text": "你希望 ChatGPT 以何种风格、个性或方式回应"
          }
        },
        {
          "Experiment": {
            "text": "请求 ChatGPT 为你回复多个示例"
          }
        }
      ]
    }
  },
  {
    "GCSWA": {
      "name": "GCSWA框架",
      "author": "小七姐",
      "description": "通过全局思维，整体框架来理解要解决的问题",
      "fields": [
        {
          "Role": {
            "info": "角色，如学术阅读",
            "text": "学术阅读"
          }
        },
        {
          "Profile": {
            "info": "版本号，作者等信息",
            "text": [
              "author: Arthur",
              "version: 0.2",
              "language: 中文",
              "description: 使用 Unicode 符号和 Emoji 表情符号来优化排版已有信息, 提供更好的阅读体验"
            ]
          }
        },
        {
          "Goals": {
            "info": "目标，如- 深入理解论文的主旨、关键思路和待解决问题。",
            "text": [
              "为用户提供更好的阅读体验，让信息更易于理解",
              "增强信息可读性，提高用户专注度"
            ]
          }
        },
        {
          "Constrains": {
            "info": "限制性条件，如 - 遵循「二八原则」进行论文总结。- 输出阅读的总结文字。",
            "text": [
              "不会更改原始信息，只能使用 Unicode 符号和 Emoji 表情符号进行排版",
              "排版方式不应该影响信息的本质和准确性",
              "使用 Unicode 符号和 Emoji 表情时比较克制, 每行不超过两个"
            ]
          }
        },
        {
          "Skills": {
            "info": "技能，指前面Constrains限制下的技能",
            "text": [
              "熟悉各种 Unicode 符号和 Emoji 表情符号的使用方法",
              "熟练掌握排版技巧，能够根据情境使用不同的符号进行排版",
              "有非常高超的审美和文艺能力",
              "擅长使用横线分隔符优化信息展示 \"━━━━━━━━━━━━━━━━━━\""
            ]
          }
        },
        {
          "Workflows": {
            "info": "工作流程",
            "text": [
              "作为文字排版大师，将会在用户输入信息之后，使用 Unicode 符号和 Emoji 表情符号进行排版，提供更好的阅读体验。",
              "1. 整体信息的第一行为标题行, 对其进行线框包围, 提升阅读体验",
              "2. 信息 item 前面添加序号 Emoji, 方便用户了解信息编号",
              "3. 信息 item 前面添加一个 Emoji, 对应该信息的核心观点",
              "4. 末尾如果有链接, 则将其用线框分隔"
            ]
          }
        }
      ]
    }
  },
  {
    "ICIO": {
      "name": "ICIO框架",
      "author": "Elavis Saravia",
      "description": "非常适用于根据特定指令和相关背景信息生成输出的领域",
      "fields": [
        {
          "Instruction": {
            "text": "即你希望 AI 执行的具体任务"
          }
        },
        {
          "Context": {
            "text": "给AI更多的背景信息引导模型做出更贴合需求的回复"
          }
        },
        {
          "InputData": {
            "text": "告知模型需要处理的数据"
          }
        },
        {
          "OutputIndicator": {
            "text": "告知模型我们要输出的类型或风格"
          }
        }
      ]
    }
  },
  {
    "结构化": {
      "name": "结构化提示词框架",
      "author": "不详",
      "description": "最全的通用提示词框架",
      "fields": [
        {
          "Role": {
            "text": "角色: 定义要模拟的角色或任务"
          }
        },
        {
          "Profile": {
            "text": "简介: 提供关于提示词作者、版本、语言等基础信息。"
          }
        },
        {
          "Background": {
            "text": "背景: 对角色或任务进行详细描述，角色的背景知识。"
          }
        },
        {
          "Goals": {
            "text": "目标：列出此任务的主要目标或希望达到的效果。"
          }
        },
        {
          "Constrains": {
            "text": "（约束条件）: 指明执行任务时需要遵守的规则或约束"
          }
        },
        {
          "Definition": {
            "text": "详细描述任务中涉及到的特定概念或名词，确保概念对齐。"
          }
        },
        {
          "Tone": {
            "text": "语气风格：描述完成任务时应采取的语言风格或情感基调，例如“正式”、“随意”、“幽默”等。"
          }
        },
        {
          "Skills": {
            "text": "技能: 列出执行此任务所需的技能或知识。"
          }
        },
        {
          "Examples": {
            "text": "示例：提供完成任务的实际示例或模板。"
          }
        },
        {
          "Workflows": {
            "text": "工作流程:描述完成任务的具体步骤或流程。"
          }
        },
        {
          "OutputFormat": {
            "text": "输出格式：描述任务的预期输出格式，例如文本、图表、列表等。"
          }
        },
        {
          "Initialization": {
            "text": "初始化：提供开始任务时的开场白或初始状态。"
          }
        }
      ]
    }
  },
];
// END FRAMEWORKS

    // 组装顶部容器
    topContainer.appendChild(selectContainer);
    topContainer.appendChild(iconContainer);

    // 动态内容区域
    const dynamicContentDiv = document.createElement('div');
    dynamicContentDiv.className = 'dynamic-content p-1';
    frameHelper.appendChild(dynamicContentDiv);

    // 加载框架数据
    function loadFrameworkData(frameworkName) {
        // 假设frameworks变量已经定义并包含所有框架数据
        const data = frameworks.find(framework => Object.keys(framework)[0] === frameworkName);

        if (data) {
            const frameworkData = data[frameworkName];
            updateDynamicContent(frameworkData);
        } else {
            console.error('Framework data not found for:', frameworkName);
        }
    }

    // 更新动态内容区域
    function updateDynamicContent(frameworkData) {
        dynamicContentDiv.innerHTML = ''; // 清除现有内容
        // 根据框架数据创建新的UI元素（例如，输入框和标签）
        const description = document.createElement('p');
        description.textContent = frameworkData.description;
        dynamicContentDiv.appendChild(description);

        // 遍历fields创建输入框和标签
        frameworkData.fields.forEach(fieldObj => {
            // 直接使用Object.entries获取键值对
            Object.entries(fieldObj).forEach(([fieldName, field]) => {
                const fieldLabel = document.createElement('label');
                fieldLabel.className = 'block text-gray-700 text-sm font-bold mb-1';
                fieldLabel.textContent = fieldName + ": ";
                if (field.info) {
                    // 添加info文本，用灰色文字表示
                    const infoText = document.createElement('span');
                    infoText.textContent = ` (${field.info})`;
                    infoText.style.color = 'grey';
                    fieldLabel.appendChild(infoText);
                }
                const textarea = document.createElement('textarea');
                textarea.className = 'w-full p-1 border border-gray-300 rounded-md'; // Tailwind类

                // 处理text，可能是数组也可能是字符串
                let textContent = '';
                if (Array.isArray(field.text)) {
                    textContent = field.text.map(textItem => {
                        if (typeof textItem === 'string') {
                            return textItem;
                        } else if (typeof textItem === 'object') {
                            return Object.values(textItem).join('\n');
                        }
                    }).join('\n');
                } else {
                    textContent = field.text;
                }

                textarea.setAttribute('placeholder', textContent);
                textarea.setAttribute('name', fieldName);

                dynamicContentDiv.appendChild(fieldLabel);
                //dynamicContentDiv.appendChild(document.createElement('br'));
                dynamicContentDiv.appendChild(textarea);
                dynamicContentDiv.appendChild(document.createElement('br'));
            });
        });

        // 提交按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '发送';
        submitButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded rounded-md';
        submitButton.onclick = () => submitForm(frameworkData.fields);

        dynamicContentDiv.appendChild(submitButton);

        // 提交按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.className = 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
        copyButton.onclick = () => copyForm(frameworkData.fields);
        dynamicContentDiv.appendChild(copyButton);
    }

    // 初始化下拉框选项
    function initSelectOptions() {
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-请选择-';
        selectElement.appendChild(defaultOption);

        // 遍历frameworks数组创建选项
        frameworks.forEach(framework => {
            // 获取框架的键名和值
            const key = Object.keys(framework)[0]; // 框架的键名（如"BROKE"）
            const value = framework[key]; // 框架的值，包含name, author等

            // 创建选项
            const option = document.createElement('option');
            option.value = key; // 选项的value是框架的键名
            option.textContent = `${value.name}-${value.description}`; // 选项的文本是框架的名称和描述
            selectElement.appendChild(option);
        });
    }

    // 获取内容
    function getFormValue(fields) {
        let prompt = "";
        fields.forEach(fieldObj => {
            // 直接使用Object.entries获取键值对
            Object.entries(fieldObj).forEach(([fieldName, field]) => {

            const input = document.querySelector(`textarea[name="${fieldName}"]`);
            prompt += `${fieldName}:\n${input.value}\n\n`;
        })});
        return prompt;
    }

    // 提交表单的逻辑
    function submitForm(fields) {
        let prompt = getFormValue(fields);
        $('#prompt-textarea').val(prompt);

        // 这里应该将prompt发送给ChatGPT的输入框
        console.log(prompt); // 示例：打印到控制台
    }

    // 提交表单的逻辑
    function copyForm(fields) {
        let prompt = getFormValue(fields);
        // 使用navigator.clipboard API复制文本到剪贴板
        navigator.clipboard.writeText(prompt).then(() => {
            // 复制成功后的操作，比如显示一个提示
            console.log('文本已复制到剪贴板');
        }).catch(err => {
            // 复制失败的操作
            console.error('复制到剪贴板失败:', err);
        });

        // 这里应该将prompt发送给ChatGPT的输入框
        console.log(prompt); // 示例：打印到控制台
    }

    initSelectOptions(); // 调用函数来填充下拉框

    // 鼠标悬停和移开事件
    frameHelper.addEventListener('mouseenter', function() {
        this.classList.add('expanded');
    });

    frameHelper.addEventListener('mouseleave', function() {
        //this.classList.remove('expanded');
        //this.innerText = '框架助手';
    });
})();
