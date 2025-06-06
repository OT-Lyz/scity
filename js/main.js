import { MoneyDisplay, PhoneIcon, MapIcon } from './UIComponents.js';

/**********************************************************************
 * 游戏数据和全局变量 
 **********************************************************************/
let player = {
    name: "小马",
    money: 10000, // 主角起始金钱
    // 后续如经验、状态等可以在此扩展
};

/**********************************************************************
 * 各个场景的定义
 **********************************************************************/

// 1. BootScene – 预加载资源（图片、音频、字体等）
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    preload() {
        // 预加载资源
        this.load.image('title', 'assets/title.png'); // 标题图片
        this.load.image('room', 'assets/room.png');   // 小马毕业后房间场景
        this.load.image('scene2', 'assets/scene2.png');     // 小马使用手机的背景
        this.load.image('player_smile', 'assets/player/smile.png');
        this.load.image('phoneIcon', 'assets/phoneIcon.png');
        this.load.image('phoneIndex', 'assets/phoneIndex.png');
        this.load.image('coin', 'assets/coin.png');//coin
        this.load.image('mapIcon', 'assets/mapIcon.png');//mapIcon

        // 预加载音效
        this.load.audio('phoneSound', 'assets/audio/message.ogg');
        this.load.audio('titleSound', 'assets/audio/开始场景ConcernedApe - JunimoKart(Title Theme).ogg');
        this.load.audio('roomSound', 'assets/audio/第一幕毕业典礼后Yoko Shimomura - Dearly Beloved (-Forest Memory-).ogg');
        this.load.audio('scene2Sound', 'assets/audio/新手教学ConcernedApe - Settling In.ogg');
        // 预加载地图和玩家行走动画
        this.load.image('map_background', 'assets/map/map.png');
        this.load.image('road', 'assets/map/道路.png');
        this.load.image('building', 'assets/map/mapIcon.png');
        this.load.image('foreground', 'assets/map/配景前排.png');
        this.load.image('stand', 'assets/player/stand.png');
        this.load.image('walking_1', 'assets/player/walking_1.png');
        this.load.image('walking_2', 'assets/player/walking_2.png');
    }
    create() {
        // 预加载完后跳转到开始场景 StartScene   MapScene
        this.scene.start('StartScene');
        //this.scene.start('MapScene');
    }
}

  
// 2. StartScene – 开始界面（标题画面）
class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }
    create() {
        let titleSound = this.sound.add('titleSound', { loop: true, volume: 0.5 });
        titleSound.play();

        // 获取摄像头中心坐标
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 添加标题图片，并设置原点为中心
        // 并计算适当的缩放比例让图片完全显示（例如留出1%的边距）
        const titleImage = this.add.image(centerX, centerY, 'title').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 1;   // 留出1%边距
        const availableHeight = this.cameras.main.height * 1;
        const scaleX = availableWidth / titleImage.width;
        const scaleY = availableHeight / titleImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        titleImage.setScale(scaleFactor);

        /****** 添加按钮文本（艺术字效果）并设置居中显示 ******/
        const startText = this.add.text(centerX, 600, "Click To Start", {
            fontFamily: '"Press Start 2P"',  // 使用像素风格字体（需在 HTML 中引入 Web 字体）
            fontSize: '32px',
            fill: '#ffffff',
            stroke: '#000000',       // 黑色描边
            strokeThickness: 4,      // 描边厚度
            shadow: {                // 添加阴影效果
                offsetX: 3,
                offsetY: 3,
                color: '#333333',
                blur: 4,
                stroke: true,
                fill: true
            }
        });
        startText.setOrigin(0.5);

        // 利用 Tween 让文本进行跳动效果（上下移动）
        this.tweens.add({
            targets: startText,
            y: startText.y - 10,  // 相对当前 y 坐标上移 20 像素
            duration: 500,        // 动画持续 500 毫秒
            ease: 'Sine.easeInOut',
            yoyo: true,           // 动画来回播放
            repeat: -1            // 无限循环
        });

        // 点击后进入场景1
        this.input.once('pointerdown', () => {
            this.sound.stopByKey('titleSound');
            this.scene.start('Scene1');
        });
    }
}



// 3. Scene1 – “毕业后的新开始”：早晨的房间场景
class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }
    create() {
        let scene2Sound = this.sound.add('scene2Sound', { loop: true, volume: 0.5 });
        scene2Sound.play();

        // 获取摄像头中心坐标
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 显示房间中透入阳光的背景（像素风格图片）
        // 计算适当缩放比例使图片完全显示，留1%边距
        const roomImage = this.add.image(centerX, centerY, 'room').setOrigin(0.5, 0.5);
        const availableWidth = this.cameras.main.width * 0.99;
        const availableHeight = this.cameras.main.height * 0.99;
        const scaleX = availableWidth / roomImage.width;
        const scaleY = availableHeight / roomImage.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        roomImage.setScale(scaleFactor);

        
        // 对话内容：使用数组存储多句对话文字
        const dialogues = [
            "Finally, I graduated from the MUA program!",
            "At last, campus life is over... ",
            "Now it’s time to start the job hunt."
        ];
        let dialogueIndex = 0; // 当前对话序号
        let isTyping = false;  // 标记当前是否正处于打字状态
        let typingEvent = null; // 保存打字事件

        // 绘制对话框：在屏幕底部，带有边框
        const dialogBoxWidth = this.cameras.main.width * 0.95;
        const dialogBoxHeight = 150;
        const dialogBoxX = this.cameras.main.centerX - dialogBoxWidth / 2;
        const dialogBoxY = this.cameras.main.height - dialogBoxHeight - 20; // 距离底部20px

        // 使用 Graphics 绘制对话框背景及边框
        const dialogGraphics = this.add.graphics();
        // 绘制半透明背景
        dialogGraphics.fillStyle(0x000000, 0.8);
        dialogGraphics.fillRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);
        // 绘制边框（这里用白色边框，线宽4）
        dialogGraphics.lineStyle(4, 0xffffff, 1);
        dialogGraphics.strokeRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight);

        // 对话框左侧显示主角的立绘
        const portraitMargin = 10;
        const portraitSize = dialogBoxHeight - 20; // 让立绘略小于对话框高度
        const portraitX = dialogBoxX + portraitMargin + portraitSize / 2;
        const portraitY = dialogBoxY + dialogBoxHeight / 2;
        const portraitImage = this.add.image(portraitX, portraitY, 'player_smile').setOrigin(0.5);
        // 如果立绘图片不符合尺寸，可使用 setDisplaySize 调整
        portraitImage.setDisplaySize(portraitSize, portraitSize);

        // 创建对话文本对象，文字区域排除掉立绘部分
        const textX = portraitX + portraitSize / 2 + 30; // 立绘右侧留10px边距
        const textY = dialogBoxY + 20;
        const dialogueText = this.add.text(textX, textY, "", {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: dialogBoxWidth - portraitSize - 30 }
        });

        // 定义函数：显示下一句对话，采用打字机效果
        const showNextDialogue = () => {
            // 如果当前正处于打字状态，则立即补全文本，并停止打字事件
            if (isTyping) {
                if (typingEvent) {
                    typingEvent.remove();
                }
                dialogueText.setText(dialogues[dialogueIndex - 1]); // 补全当前对话
                isTyping = false;
                return;
            }
            // 进入下一句对话（若还有未显示的内容）
            if (dialogueIndex < dialogues.length) {
                let fullText = dialogues[dialogueIndex];
                dialogueText.setText(""); // 清空现有文本
                isTyping = true;
                let charIndex = 0;
                // 利用 Timer 事件实现逐字符显示，每20毫秒显示1个字符
                typingEvent = this.time.addEvent({
                    delay: 20,
                    repeat: fullText.length - 1,
                    callback: () => {
                        dialogueText.text += fullText.charAt(charIndex);
                        charIndex++;
                        if (charIndex >= fullText.length) {
                            isTyping = false;
                        }
                    }
                });
                dialogueIndex++;
            } else {
                // 所有对话显示完毕，进入下一个场景（你可以根据需要调整这部分逻辑）
                this.scene.start('Scene2');
            }
        };

        // 显示第一句对话
        showNextDialogue();

        // 为对话框添加点击交互：点击对话框区域触发显示下一句
        dialogGraphics.setInteractive(
            new Phaser.Geom.Rectangle(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight),
            Phaser.Geom.Rectangle.Contains
        );
        dialogGraphics.on('pointerdown', showNextDialogue);

        // 同时，监听空格键，以便显示下一句文本
        this.input.keyboard.on('keydown-SPACE', showNextDialogue);
    }
}


// 2. Scene2 – “使用手机指南”：指导玩家如何使用手机
class Scene2 extends Phaser.Scene {
    constructor() {
        super('Scene2');
    }
    
    create() {
        // 初始化全局数据（使用Phaser的registry代替window全局变量）
        if (!this.registry.get('money')) {
            this.registry.set('money', 10000);
        }

        // ==================== 保留的核心部分 ====================
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // ---------------- 1. 背景设置 ----------------
        const scene2Image = this.add.image(centerX, centerY, 'scene2').setOrigin(0.5, 0.5);
        const scaleFactor = Math.min(
            (this.cameras.main.width * 0.99) / scene2Image.width,
            (this.cameras.main.height * 0.99) / scene2Image.height
        );
        scene2Image.setScale(scaleFactor);


        // ---------------- 2. 系统消息对话框（点击推进） ----------------
let msgGraphics, systemText;
let isTyping = false;
let typingEvent = null;
let dialogueIndex = 0;

// 初始化消息框
const initMessageBox = () => {
    const msgBoxWidth = this.cameras.main.width * 0.6;
    const msgBoxHeight = 125;
    const msgBoxX = centerX - msgBoxWidth / 2;
    const msgBoxY = centerY - msgBoxHeight / 2;
    
    // 创建图形和文本
    msgGraphics = this.add.graphics()
        .fillStyle(0x000000, 0.9)
        .fillRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight);
    
    const textMargin = 20;
    systemText = this.add.text(
        msgBoxX + textMargin, 
        msgBoxY + textMargin, 
        "", 
        {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: msgBoxWidth - 2 * textMargin }
        }
    );
    
    // 设置交互
    msgGraphics.setInteractive(
        new Phaser.Geom.Rectangle(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight),
        Phaser.Geom.Rectangle.Contains
    );

    // 绑定点击事件
    msgGraphics.on('pointerdown', handleDialogueClick);
};

/** 对话内容 */
const dialogues = [
    "You currently have ¥10000 in savings. Every cent must be spent wisely.",
    "Your goal — find a full-time job and settle down in S City."
];

/** 处理对话框点击 */
const handleDialogueClick = () => {
    if (isTyping) {
        // 立即完成当前打字效果
        typingEvent.remove();
        systemText.setText(dialogues[dialogueIndex - 1]);
        isTyping = false;
        return;
    }

    if (dialogueIndex < dialogues.length) {
        // 播放下一句对话
        typeDialogue(dialogues[dialogueIndex], () => {
            dialogueIndex++;
        });
    } else {
        // 对话结束处理
        msgGraphics.off('pointerdown', handleDialogueClick);
        startPhoneInstruction();
    }
};

/** 打字机效果 */
const typeDialogue = (fullText, onComplete) => {
    systemText.setText("");
    let charIndex = 0;
    isTyping = true;
    
    typingEvent = this.time.addEvent({
        delay: 20,
        repeat: fullText.length - 1,
        callback: () => {
            systemText.text += fullText.charAt(charIndex);
            if (++charIndex >= fullText.length) {
                isTyping = false;
                onComplete?.();
            }
        }
    });
};

// 初始化并开始对话
initMessageBox();
handleDialogueClick(); // 自动开始第一句

/** 
        // ---------------- 2. 系统消息对话框（调整为场景局部变量） ----------------
        let msgGraphics, systemText; // 不再使用window全局变量
        let isTyping = false;
        let typingEvent = null;
        
        // 初始化消息框
        const initMessageBox = () => {
            const msgBoxWidth = this.cameras.main.width * 0.6;
            const msgBoxHeight = 125;
            const msgBoxX = centerX - msgBoxWidth / 2;
            const msgBoxY = centerY - msgBoxHeight / 2;
            
            // 创建图形和文本
            msgGraphics = this.add.graphics()
                .fillStyle(0x000000, 0.9)
                .fillRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight);
            
            const textMargin = 20;
            systemText = this.add.text(
                msgBoxX + textMargin, 
                msgBoxY + textMargin, 
                "", 
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    fill: '#ffffff',
                    wordWrap: { width: msgBoxWidth - 2 * textMargin }
                }
            );
            
            // 设置交互
            msgGraphics.setInteractive(
                new Phaser.Geom.Rectangle(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight),
                Phaser.Geom.Rectangle.Contains
            );
        };

        //对话系统
        const dialogues = [
            "You currently have ¥10000 in savings. Every cent must be spent wisely.",
            "Your goal — find a full-time job and settle down in S City."
        ];
        
        const typeDialogue = (fullText, onComplete) => {
            systemText.setText("");
            let charIndex = 0;
            isTyping = true;
            typingEvent = this.time.addEvent({
                delay: 20,
                repeat: fullText.length - 1,
                callback: () => {
                    systemText.text += fullText.charAt(charIndex);
                    if (++charIndex >= fullText.length) {
                        isTyping = false;
                        onComplete?.();
                    }
                }
            });
        };
         
        */

        // ---------------- 4. 手机引导阶段 ----------------
        const startPhoneInstruction = () => {
            // 销毁消息框元素
            msgGraphics.destroy();
            systemText.destroy();
            
            // 添加遮罩
            this.overlay = this.add.rectangle(
                centerX, centerY, 
                this.cameras.main.width, 
                this.cameras.main.height, 
                0x000000, 0.5
            );
            
            // 初始化手机图标组件
            this.phoneIcon = new PhoneIcon(this, () => {
                // 首次点击处理
                if (!this.phoneIcon.hasFirstClicked) return;
                
                // 移除遮罩和首次提示
                this.overlay.destroy();
                if (this.phoneInstructionText) {
                    this.phoneInstructionText.destroy();
                    this.phoneInstructionText = null;
                }
                
                this.togglePhoneInterface();
            });
            
            // 添加首次提示文字
            this.phoneInstructionText = this.add.text(
                this.phoneIcon.x - 10,
                this.phoneIcon.y + this.phoneIcon.height + 20,
                "Click the phone icon to open your phone.",
                { fontFamily: 'Arial',
                    fontSize: '20px',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4 }
            ).setOrigin(1, 0);
        };

        // ---------------- 5. 手机界面切换功能 ----------------
        this.togglePhoneInterface = () => {
            if (!this.phoneInterface) {
                // 先创建手机界面实例
                this.phoneInterface = this.add.image(centerX, centerY, 'phoneIndex');
                
                // 通过纹理管理器直接获取纹理
                const texture = this.textures.get('phoneIndex');
                const scale = Math.min(
                    (this.cameras.main.width * 0.7) / texture.getSourceImage().width,
                    (this.cameras.main.height * 0.7) / texture.getSourceImage().height
                );
                this.phoneInterface.setScale(scale);
                
                // 添加使用提示（只显示一次）
                if (!this.phoneHelpDismissed) {
                    this.phoneHelpText = this.add.text(
                        centerX,
                        this.phoneInterface.y + this.phoneInterface.displayHeight/2 + 20,
                        "You can open your phone anytime to check messages, track spending, or manage tasks.",
                        { 
                            fontFamily: 'Arial',
                            fontSize: '20px',
                            fill: '#ffffff',
                            stroke: '#000000',
                            strokeThickness: 4 
                        }
                    ).setOrigin(0.5);
                }
            }  else {
                // 切换可见性
                const shouldShow = !this.phoneInterface.visible;
                this.phoneInterface.setVisible(shouldShow);
                
                // 处理帮助文字
                if (this.phoneHelpText) {
                    if (shouldShow && !this.phoneHelpDismissed) {
                        this.phoneHelpText.setVisible(true);
                    } else {
                        // 第二次关闭时永久移除帮助文字
                        this.phoneHelpText.destroy();
                        this.phoneHelpText = null;
                        this.phoneHelpDismissed = true;
                    }
                }
            }
            
            // 当关闭手机界面时显示地图提示
            if (!this.phoneInterface.visible) {
                this.showMapPrompt();
            }
        };

        // ---------------- 6. 地图提示功能 ----------------
        this.showMapPrompt = () => {
            // 添加遮罩
            const overlay = this.add.rectangle(
                centerX, centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000, 0.5
            );
    
            // 初始化地图图标组件
            this.mapIcon = new MapIcon(this, () => {
                // 点击回调处理
                overlay.destroy();
                this.scene.start('MapScene');
            });
        };

        /**
        this.showMapPrompt = () => {
            const overlay = this.add.rectangle(centerX, centerY, 
                this.cameras.main.width, 
                this.cameras.main.height, 
                0x000000, 0.5
            );
            
            this.mapIcon = new MapIcon(this, () => {
                overlay.destroy();
                this.scene.start('MapScene');
            });
            
            // 添加地图提示文字
            this.mapInstructionText = this.add.text(
                this.mapIcon.x - 50,
                this.mapIcon.y + this.mapIcon.height + 20,
                "Click the map icon to continue",
                { fontFamily: 'Arial',
                            fontSize: '20px',
                            fill: '#ffffff',
                            stroke: '#000000',
                            strokeThickness: 4 }
            ).setOrigin(1, 0);
        }; */

        // ==================== 初始化流程 ====================
        // 1. 初始化UI组件
        this.moneyDisplay = new MoneyDisplay(this);
        /** 
        // 2. 启动对话系统
        initMessageBox();
        let dialogueIndex = 0;
        const showNextDialogue = () => {
            if (isTyping) {
                typingEvent?.remove();
                systemText.setText(dialogues[dialogueIndex-1]);
                isTyping = false;
                return;
            }
            
            if (dialogueIndex < dialogues.length) {
                typeDialogue(dialogues[dialogueIndex++], showNextDialogue);
            } else {
                startPhoneInstruction();
            }
        };
        
        msgGraphics.on('pointerdown', showNextDialogue);
        this.input.keyboard.on('keydown-SPACE', showNextDialogue);
        showNextDialogue();*/
    }
}


// 6. MapScene – 主地图：显示各地点的解锁状态
class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
        
    create() {


        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        
        // 获取画布的宽度和高度
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // 初始化公共组件
        this.moneyDisplay = new MoneyDisplay(this);
        this.phoneIcon = new PhoneIcon(this, () => this.togglePhoneInterface());
        this.mapIcon = new MapIcon(this, () => this.scene.start('MapScene'));
        this.moneyDisplay.container.setDepth(100);
        this.phoneIcon.icon.setDepth(100);
        this.mapIcon.mapIcon.setDepth(100);

    


        // ------------------ 添加地图图层 ------------------

        // 地图背景：放在最底层
        this.bg = this.add.image(0, 0, 'map_background')
            .setOrigin(0)
            .setDepth(0);
        // 计算背景图片缩放因子，保证背景不会超过画布区域
        let bgScale = Math.min(canvasWidth / this.bg.width, canvasHeight / this.bg.height);
        this.bg.setScale(bgScale);

        // 道路：与建筑一起位于底层
        this.road = this.add.image(0, 0, 'road')
            .setOrigin(0)
            .setDepth(0);
        // 同样计算缩放因子
        let roadScale = Math.min(canvasWidth / this.road.width, canvasHeight / this.road.height);
        this.road.setScale(roadScale);

        // 建筑：同样放在底层
        this.buildings = this.add.image(0, 0, 'building')
            .setOrigin(0)
            .setDepth(0);
        let buildingScale = Math.min(canvasWidth / this.buildings.width, canvasHeight / this.buildings.height);
        this.buildings.setScale(buildingScale);

        // ------------------ 创建玩家 ------------------
        // 注意：玩家图像通常按原尺寸绘制，不需要调整至全屏，但可以根据需要设置位置
        this.player = this.add.sprite(centerX, centerY, 'stand')
            .setDepth(1)
            .setScale(0.4);

        // 为玩家创建行走动画，帧图为 "walking_1" 和 "walking_2"
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'walking_1' },
                { key: 'walking_2' }
            ],
            frameRate: 8,  // 每秒8帧
            repeat: -1     // 无限循环
        });

        // ------------------ 添加前景图层 ------------------
        // 前景层覆盖在玩家上，即深度最高
        this.foreground = this.add.image(0, 0, 'foreground')
            .setOrigin(0)
            .setDepth(2);
        let foregroundScale = Math.min(canvasWidth / this.foreground.width, canvasHeight / this.foreground.height);
        this.foreground.setScale(foregroundScale);

        
        // ------------------ 设置玩家移动限制区域 ------------------
        // 假设允许玩家行走的“道路区域”为下面这个矩形（可根据实际地图调整）
        // 格式：new Phaser.Geom.Rectangle(x, y, width, height)
        this.allowedArea = new Phaser.Geom.Rectangle(100, 300, 600, 150);
        
        // （可选：画出调试区域以便查看 allowedArea）
        // let debug = this.add.graphics();
        // debug.lineStyle(2, 0xff0000);
        // debug.strokeRectShape(this.allowedArea);
        
        // ------------------ 键盘输入设置 ------------------
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

    }
    
    update(time, delta) {
        const speed = 350;   // 角色移动速度，单位：像素/秒
        let vx = 0, vy = 0;
        
        if (this.keys.left.isDown) {
            vx = -speed;
        }
        if (this.keys.right.isDown) {
            vx = speed;
        }
        if (this.keys.up.isDown) {
            vy = -speed;
        }
        if (this.keys.down.isDown) {
            vy = speed;
        }
        
        // 如果有按键输入，则移动玩家并播放行走动画
        if (vx !== 0 || vy !== 0) {
            // 启动行走动画（如果尚未在播放）
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('walk');
            }
            // 如果水平移动，则根据方向翻转（左移时翻转，否则保持默认）
            if (vx < 0) {
                this.player.setFlipX(true);
            } else if (vx > 0) {
                this.player.setFlipX(false);
            }
            
            // 根据时间增量更新位置（delta 为毫秒）
            let dt = delta / 1000;
            let newX = this.player.x + vx * dt;
            let newY = this.player.y + vy * dt;
            
            // 限制玩家位置只能在 allowedArea 中
            newX = Phaser.Math.Clamp(newX, this.allowedArea.x, this.allowedArea.x + this.allowedArea.width);
            newY = Phaser.Math.Clamp(newY, this.allowedArea.y, this.allowedArea.y + this.allowedArea.height);
            this.player.setPosition(newX, newY);
        }
        else {
            // 没有键盘输入时：停止动画，显示静止的 "stand" 图
            if (this.player.anims.isPlaying) {
                this.player.anims.stop();
            }
            this.player.setTexture('stand');
        }
    }


    
}



/**********************************************************************
 * Phaser 游戏配置与启动
 **********************************************************************/
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,                // 自适应，保持宽高比
        autoCenter: Phaser.Scale.CENTER_BOTH,    // 居中显示
        width: window.innerWidth,                // 宽度设为浏览器窗口的宽度
        height: window.innerHeight               // 高度设为浏览器窗口的高度
    },
    backgroundColor: "#000000",
    scene: [BootScene, StartScene, Scene1, Scene2, MapScene],
    pixelArt: true, // 保持像素风格
};

const game = new Phaser.Game(config);