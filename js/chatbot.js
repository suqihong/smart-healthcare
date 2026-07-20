(function () {
    'use strict';

    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var sendBtn = document.getElementById('sendBtn');
    var voiceBtn = document.getElementById('voiceBtn');
    var newChatBtn = document.getElementById('newChatBtn');

    var diagnosisDB = {
        '头痛': {
            questions: ['头痛持续多长时间了？', '头痛的部位在哪里？（前额/太阳穴/后脑勺/全头）', '头痛的性质是？（胀痛/刺痛/跳痛/钝痛）'],
            followUp: {
                '胀痛': { advice: '胀痛型头痛可能与紧张性头痛有关，建议：\n1. 适当休息，避免长时间用眼\n2. 可尝试热敷颈肩部\n3. 如持续超过3天，建议就医检查', severity: 'medium' },
                '刺痛': { advice: '刺痛型头痛需注意排除神经痛可能，建议：\n1. 记录疼痛发作时间和频率\n2. 避免冷风直吹头部\n3. 建议尽早就诊神经内科', severity: 'high' },
                '跳痛': { advice: '跳痛型头痛可能与偏头痛有关，建议：\n1. 在安静暗室中休息\n2. 避免强光和噪音刺激\n3. 如频繁发作，建议神经内科就诊', severity: 'medium' },
                '钝痛': { advice: '钝痛型头痛可能与疲劳或压力有关，建议：\n1. 保证充足睡眠（7-8小时）\n2. 适度运动放松\n3. 如持续加重，建议就医', severity: 'low' },
            },
            general: '头痛可能由多种原因引起，包括紧张、疲劳、偏头痛等。建议您注意休息，如症状持续或加重，请及时就医。'
        },
        '发烧': {
            questions: ['体温是多少度？', '发烧持续多长时间了？', '有伴随其他症状吗？（咳嗽/咽痛/鼻塞/肌肉酸痛）'],
            followUp: {
                '咳嗽': { advice: '发烧伴咳嗽可能为呼吸道感染，建议：\n1. 多饮温水，保持室内通风\n2. 体温超过38.5°C可适当服用退烧药\n3. 如持续3天以上，建议就医检查', severity: 'medium' },
                '咽痛': { advice: '发烧伴咽痛可能为咽炎或扁桃体炎，建议：\n1. 温盐水漱口\n2. 避免辛辣刺激食物\n3. 如咽部有明显红肿，建议耳鼻喉科就诊', severity: 'medium' },
            },
            general: '发烧是身体对抗感染的防御反应。建议多休息、多饮水，体温超过38.5°C可适当使用退烧药。如持续高烧不退，请及时就医。'
        },
        '咳嗽': {
            questions: ['咳嗽持续多长时间了？', '是干咳还是有痰？', '什么时间段咳嗽更严重？'],
            followUp: {
                '干咳': { advice: '干咳可能与过敏或气道刺激有关，建议：\n1. 保持室内湿度适宜\n2. 避免烟尘刺激\n3. 如超过2周不见好转，建议呼吸科就诊', severity: 'medium' },
                '有痰': { advice: '有痰咳嗽可能为支气管炎，建议：\n1. 多饮温水帮助化痰\n2. 注意观察痰的颜色\n3. 如痰中带血或呈黄绿色，请及时就医', severity: 'medium' },
            },
            general: '咳嗽是呼吸道常见的防御反应。建议注意保暖、多饮温水，如持续超过2周或伴有其他严重症状，请及时就医。'
        },
        '胸闷': {
            questions: ['胸闷出现多长时间了？', '是持续性还是间歇性的？', '有伴随胸痛、心悸或呼吸困难吗？'],
            followUp: {},
            general: '⚠️ 胸闷可能涉及心血管系统，建议：\n1. 立即停止活动，保持安静休息\n2. 如伴有胸痛、大汗、呼吸困难，请立即拨打120\n3. 建议尽早就诊心内科进行排查'
        },
        '失眠': {
            questions: ['失眠持续多长时间了？', '是入睡困难还是容易醒来？', '睡前有什么习惯？（看手机/喝茶咖啡/运动）'],
            followUp: {},
            general: '失眠可能由压力、不良习惯或身体不适引起，建议：\n1. 建立规律作息，固定睡眠时间\n2. 睡前1小时避免使用电子设备\n3. 可尝试冥想、深呼吸放松\n4. 如持续超过1个月，建议就诊睡眠科'
        },
        '胃痛': {
            questions: ['胃痛的位置在哪里？', '是饭前痛还是饭后痛？', '有反酸、恶心或呕吐吗？'],
            followUp: {},
            general: '胃痛可能与胃炎、胃溃疡等疾病有关，建议：\n1. 规律饮食，避免过饥过饱\n2. 少吃辛辣、油腻、生冷食物\n3. 如疼痛剧烈或伴有黑便，请立即就医'
        },
        '过敏': {
            questions: ['过敏症状是什么？（皮肤红疹/打喷嚏/呼吸困难）', '最近接触过什么可能的过敏原？', '以前有过敏史吗？'],
            followUp: {},
            general: '过敏反应需重视，建议：\n1. 尽量避免接触已知过敏原\n2. 轻度过敏可服用抗组胺药物\n3. 如出现呼吸困难、面部肿胀，请立即就医'
        },
        '乏力': {
            questions: ['乏力持续多长时间了？', '最近睡眠质量如何？', '有其他伴随症状吗？'],
            followUp: {},
            general: '乏力可能由多种原因引起，建议：\n1. 保证充足睡眠和规律作息\n2. 均衡饮食，注意补充铁和维生素B12\n3. 适度运动增强体质\n4. 如长期乏力无改善，建议全面体检'
        }
    };

    var conversationState = {
        currentSymptom: null,
        questionIndex: 0,
        answers: [],
        phase: 'initial'
    };

    function addMessage(content, isUser) {
        var div = document.createElement('div');
        div.className = 'message ' + (isUser ? 'user-message' : 'ai-message');

        var avatarSvg = isUser
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

        div.innerHTML = '<div class="message-avatar">' + avatarSvg + '</div>' +
            '<div class="message-content">' + content + '</div>';

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        var div = document.createElement('div');
        div.className = 'message ai-message';
        div.id = 'typingIndicator';
        div.innerHTML = '<div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></div>' +
            '<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        var indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function processInput(text) {
        if (!text.trim()) return;

        addMessage('<p>' + escapeHtml(text) + '</p>', true);

        if (conversationState.phase === 'initial') {
            var matchedSymptom = null;
            Object.keys(diagnosisDB).forEach(function (key) {
                if (text.includes(key)) {
                    matchedSymptom = key;
                }
            });

            if (matchedSymptom) {
                conversationState.currentSymptom = matchedSymptom;
                conversationState.questionIndex = 0;
                conversationState.answers = [];
                conversationState.phase = 'questioning';

                addTypingIndicator();
                setTimeout(function () {
                    removeTypingIndicator();
                    var diagnosis = diagnosisDB[matchedSymptom];
                    addMessage('<p>我了解了，您的主要症状是<strong>' + matchedSymptom + '</strong>。为了更准确地分析，我需要了解一些详细信息。</p>' +
                        '<p>' + diagnosis.questions[0] + '</p>');
                    conversationState.questionIndex = 1;
                }, 1000);
            } else {
                addTypingIndicator();
                setTimeout(function () {
                    removeTypingIndicator();
                    addMessage('<p>感谢您的描述。根据您提供的信息，我建议您：</p>' +
                        '<p>1. 注意休息，保持良好的生活习惯<br>2. 如症状持续或加重，建议到医院进行详细检查<br>3. 您也可以选择下方的常见症状进行更精准的分析</p>' +
                        '<div class="quick-replies">' +
                        '<button class="quick-reply" data-reply="我最近经常头痛">头痛</button>' +
                        '<button class="quick-reply" data-reply="我感觉有点发烧">发烧</button>' +
                        '<button class="quick-reply" data-reply="我咳嗽好几天了">咳嗽</button>' +
                        '<button class="quick-reply" data-reply="我晚上睡不好">失眠</button>' +
                        '</div>');
                }, 1000);
            }
        } else if (conversationState.phase === 'questioning') {
            conversationState.answers.push(text);
            var diagnosis = diagnosisDB[conversationState.currentSymptom];

            if (conversationState.questionIndex < diagnosis.questions.length) {
                addTypingIndicator();
                setTimeout(function () {
                    removeTypingIndicator();
                    addMessage('<p>' + diagnosis.questions[conversationState.questionIndex] + '</p>');
                    conversationState.questionIndex++;
                }, 800);
            } else {
                conversationState.phase = 'diagnosed';
                addTypingIndicator();
                setTimeout(function () {
                    removeTypingIndicator();
                    var matchedFollowUp = null;
                    var followUp = diagnosis.followUp || {};
                    Object.keys(followUp).forEach(function (key) {
                        if (text.includes(key)) {
                            matchedFollowUp = key;
                        }
                    });

                    var advice = matchedFollowUp ? followUp[matchedFollowUp].advice : diagnosis.general;
                    var severity = matchedFollowUp ? followUp[matchedFollowUp].severity : 'low';

                    var severityLabel = severity === 'high' ? '⚠️ 需重视' : severity === 'medium' ? '⚡ 需关注' : '✅ 可观察';
                    var severityClass = severity === 'high' ? 'danger' : severity === 'medium' ? 'warning' : 'normal';

                    addMessage('<p><strong>📋 智能分析结果</strong></p>' +
                        '<p>主要症状：' + conversationState.currentSymptom + '</p>' +
                        '<p>风险等级：<span class="dash-badge ' + severityClass + '">' + severityLabel + '</span></p>' +
                        '<p style="margin-top:12px;white-space:pre-line">' + advice + '</p>' +
                        '<p style="margin-top:12px;font-size:12px;color:var(--text-muted)">⚠️ 以上分析仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。</p>' +
                        '<div class="quick-replies">' +
                        '<button class="quick-reply" data-reply="我想咨询其他症状">咨询其他症状</button>' +
                        '<button class="quick-reply" onclick="scrollToSection(\'appointment\')">预约医生</button>' +
                        '</div>');
                }, 1500);
            }
        } else if (conversationState.phase === 'diagnosed') {
            if (text.includes('其他症状') || text.includes('其他')) {
                conversationState = { currentSymptom: null, questionIndex: 0, answers: [], phase: 'initial' };
                addTypingIndicator();
                setTimeout(function () {
                    removeTypingIndicator();
                    addMessage('<p>好的，请描述您的新症状，或选择下方常见症状：</p>' +
                        '<div class="quick-replies">' +
                        '<button class="quick-reply" data-reply="我最近经常头痛">头痛</button>' +
                        '<button class="quick-reply" data-reply="我感觉有点发烧">发烧</button>' +
                        '<button class="quick-reply" data-reply="我咳嗽好几天了">咳嗽</button>' +
                        '<button class="quick-reply" data-reply="我晚上睡不好">失眠</button>' +
                        '</div>');
                }, 800);
            } else {
                conversationState = { currentSymptom: null, questionIndex: 0, answers: [], phase: 'initial' };
                processInput(text);
            }
        }
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sendBtn.addEventListener('click', function () {
        var text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        processInput(text);
    });

    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            var text = chatInput.value.trim();
            if (!text) return;
            chatInput.value = '';
            processInput(text);
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('quick-reply')) {
            var reply = e.target.getAttribute('data-reply');
            if (reply) processInput(reply);
        }
    });

    document.querySelectorAll('.tag[data-symptom]').forEach(function (tag) {
        tag.addEventListener('click', function () {
            var symptom = tag.getAttribute('data-symptom');
            chatInput.value = '我' + symptom + '了';
            processInput(chatInput.value);
            chatInput.value = '';
        });
    });

    newChatBtn.addEventListener('click', function () {
        chatMessages.innerHTML = '';
        conversationState = { currentSymptom: null, questionIndex: 0, answers: [], phase: 'initial' };
        addMessage('<p>您好！我是智医云AI助手，很高兴为您服务。请描述您的症状或选择下方常见症状，我将为您进行智能分析。</p>' +
            '<div class="quick-replies">' +
            '<button class="quick-reply" data-reply="我最近经常头痛">经常头痛</button>' +
            '<button class="quick-reply" data-reply="我感觉有点发烧">感觉发烧</button>' +
            '<button class="quick-reply" data-reply="我咳嗽好几天了">持续咳嗽</button>' +
            '<button class="quick-reply" data-reply="我晚上睡不好">睡眠问题</button>' +
            '</div>', false);
    });

    var recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            voiceBtn.classList.remove('listening');
        };

        recognition.onerror = function () {
            voiceBtn.classList.remove('listening');
        };

        recognition.onend = function () {
            voiceBtn.classList.remove('listening');
        };
    }

    voiceBtn.addEventListener('click', function () {
        if (!recognition) {
            window.showToast('您的浏览器不支持语音输入', 'error');
            return;
        }
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
            voiceBtn.classList.remove('listening');
        } else {
            recognition.start();
            voiceBtn.classList.add('listening');
            window.showToast('正在聆听，请说话...', 'info');
        }
    });

})();