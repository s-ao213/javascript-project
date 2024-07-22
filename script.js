function copyCode(codeId) {
    const code = document.getElementById(codeId).innerText;
    navigator.clipboard.writeText(code).then(() => {
        const copyButton = document.querySelector(`button[onclick="copyCode('${codeId}')"]`);
        copyButton.innerText = 'コピーしました';
        setTimeout(() => {
            copyButton.innerText = 'コピー';
        }, 2000);
    }).catch(err => {
        console.error('コピーに失敗しました:', err);
    });
}

document.getElementById('overlay-input').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
});

document.querySelectorAll('.menu-item').forEach(function(item) {
    item.addEventListener('click', function() {
        document.getElementById('overlay-input').checked = false;
        document.body.classList.remove('no-scroll');
    });
});

document.getElementById('overlay-input').addEventListener('change', function() {
    if (!this.checked) {
        // メニューが閉じられたときにスクロール位置をリセット
        document.getElementById('overlay').scrollTop = 0;
    }
});
