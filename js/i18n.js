(function(){
    const dictionaries = {
        'zh-CN': {
            title: 'Solitaire - 纸牌接龙',
            header: 'Solitaire - 纸牌接龙',
            new_game: '新游戏',
            undo: '撤销',
            score_label: '得分:',
            time_label: '时间:',
            game_over: '游戏结束!',
            congrats: '恭喜你完成了游戏!',
            final_score: '最终得分:',
            final_time: '用时:',
            play_again: '再玩一次',
            lang_label: '语言:'
        },
        'en': {
            title: 'Solitaire',
            header: 'Solitaire',
            new_game: 'New Game',
            undo: 'Undo',
            score_label: 'Score:',
            time_label: 'Time:',
            game_over: 'Game Over!',
            congrats: 'Congratulations!',
            final_score: 'Final Score:',
            final_time: 'Time:',
            play_again: 'Play Again',
            lang_label: 'Language:'
        }
    };

    const I18N_STORAGE_KEY = 'solitaire.lang';

    function getCurrentLang() {
        return localStorage.getItem(I18N_STORAGE_KEY) || document.documentElement.lang || 'zh-CN';
    }

    function setCurrentLang(lang) {
        localStorage.setItem(I18N_STORAGE_KEY, lang);
        document.documentElement.lang = lang;
    }

    function t(key, lang) {
        const d = dictionaries[lang] || dictionaries['en'];
        return d[key] || key;
    }

    function applyTranslations(lang) {
        const current = lang || getCurrentLang();
        const nodes = document.querySelectorAll('[data-i18n]');
        nodes.forEach(node => {
            const key = node.getAttribute('data-i18n');
            if (!key) return;
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.placeholder = t(key, current);
            } else {
                node.textContent = t(key, current);
            }
        });
        // Update title
        document.title = t('title', current);
    }

    function initLanguage(selectEl) {
        const lang = getCurrentLang();
        setCurrentLang(lang);
        applyTranslations(lang);
        if (selectEl) {
            selectEl.value = lang;
            selectEl.addEventListener('change', (e) => {
                const newLang = e.target.value;
                setCurrentLang(newLang);
                applyTranslations(newLang);
            });
        }
    }

    window.i18n = {
        dictionaries,
        t,
        applyTranslations,
        initLanguage,
        getCurrentLang,
        setCurrentLang,
    };
})(); 