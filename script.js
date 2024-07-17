function copyCode() {
    const code = document.querySelector('pre code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const copyButton = document.querySelector('.copy-button');
        copyButton.innerText = 'コピーしました';
        setTimeout(() => {
            copyButton.innerText = 'コピー';
        }, 2000);
    }).catch(err => {
        console.error('コピーに失敗しました:', err);
    });
}