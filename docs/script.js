function katakanaToHiragana(text) {
    return text.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

function hiraganaToUpperCase(text) {
    // ひらがなの小文字と大文字の対応を定義
    var conversionMap = {
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
        'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
        'っ': 'つ', 'ゎ': 'わ'
    };

    // テキスト中のひらがなの小文字を大文字に変換する
    var upperCaseText = text.replace(/[\u3041-\u3096]/g, function(match) {
        return conversionMap[match] || match;
    });
    return upperCaseText;
}

function kanjiToHiragana(text) {
    var apiUrl = 'https://api.excelapi.org/language/kanji2kana?text=' + encodeURIComponent(text);

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // 変換されたひらがなを取得する
        var hiraganaText = data.text;
        return hiraganaText;
    })
    .catch(error => {
        console.error('APIリクエストエラー:', error);
    });
    return '';
}

function convert() {
    var inputText = document.getElementById("inputText").value;
    var outputCanvas = document.getElementById("outputCanvas");
    var ctx = outputCanvas.getContext("2d");

    // カタカナをひらがなに変換
    var text = katakanaToHiragana(inputText);

    // ひらがな小文字を大文字に変換する
    text = hiraganaToUpperCase(text);

    // 漢字をひらがなに変換
    // text = kanjiToHiragana(text);

    // ひらがな以外を除去 //「ゐゑゔゕゖ」も除去
    text = text.replace(/[^\u3041-\u308f\u3092-\u3093\s]/g, '');

    // テキストを改行で分割して、1行ずつ描画する
    var lines = text.split('\n');

    // Canvasサイズを設定
    const fontSize = 60;
    const marginSize = 20;
    const h = lines.length * (fontSize + marginSize) + marginSize;
    outputCanvas.width = 2000; // 一時的に十分大きい数字にする。最後に横幅を調整する。
    outputCanvas.height = h;

    // 背景色を設定
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    // フォントの読み込み
    var font = new FontFace('MoonStarSunFont', 'url(MoonStarSunFont.ttf)');
    font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);

        // フォントを適用
        ctx.font = fontSize + 'px MoonStarSunFont';
        ctx.fillStyle = 'rgb(0, 0, 0)';

        // テキストを描画
        var dy = (fontSize + marginSize);
        var w = 10;
        lines.forEach(function(line) {
            ctx.fillText(line, marginSize, dy);
            dy += (fontSize + marginSize);
            w = Math.max(w, ctx.measureText(line).width + 2 * marginSize);
        });

        // 現在の描画内容を一時的に保存
        var imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

        // 新しい幅を設定
        outputCanvas.width = w;

        // 保存された描画内容を復元
        ctx.putImageData(imageData, 0, 0);

    }).catch(function(error) {
        console.log('フォントの読み込みエラー:', error);
    });

}

document.getElementById("download").onclick = (event) => {
    let canvas = document.getElementById("outputCanvas");

    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "image.png";
    link.click();
}

function loadRandomImage() {
    // 画像のURLを配列で定義
    var images = [
        "img/sara.png",
        "img/kabin.png",
        "img/rousokutate.png",
        "img/propeller.png",
        "img/aburae.png",
        "img/record.png",
        "img/ningyou.png",
        "img/wineglass.png",
        "img/trump.png",
        "img/futsugojiten.png",
        "img/danro.png",
        "img/hannin.png"
    ];

    // ランダムな画像を選択
    var randomIndex = Math.floor(Math.random() * images.length);
    var randomImageSrc = images[randomIndex];

    // 画像を表示
    var randomImage = document.getElementById("sampleImage");
    randomImage.src = randomImageSrc;
}

loadRandomImage();
