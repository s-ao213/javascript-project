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
