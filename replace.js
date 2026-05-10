const fs = require('fs');

const mappings = {
    'Attack+on+Titan': 'Attack_On_Titan.png',
    'Bleach+TYBW': 'Bleach_TYBW.png',
    'Chainsaw+Man': 'Chainsaw_Man.png',
    'Cowboy+Bebop': 'Cowboy_Bebop.png',
    'Death+Note': 'Death_Note.png',
    'Demon+Slayer': 'Demon_Slayer.png',
    'Frieren': "Frieren Beyond Journey's End.png",
    'FMA+B': 'Fullmetal_Alchemist_Brotherhood.png',
    'HxH': 'Hunter_x_Hunter.png',
    'Jujutsu+Kaisen': 'Jujutsu_Kaisen.png',
    'MHA': 'My_Hero_Academia.png',
    'Naruto': 'Naruto_Shippuden.png',
    'One+Punch+Man': 'One_Punch_Man.png',
    'Re+Zero': 'Re_Zero.png',
    'Solo+Leveling': 'Solo_Leveling.png',
    'Spy+x+Family': 'Spy_x_Family.png',
    'Steins+Gate': 'Steins;_Gate.png',
    'Tokyo+Ghoul': 'Tokyo_Ghoul.png',
    'Toradora': 'Toradora!.png',
    'Vinland+Saga': 'Vinland_Saga.png',
    'Your+Name': 'Your_Name.png'
};

const files = ['index.html', 'library.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. First, fix the incorrect .jpg assignments made earlier and One_Piece_2.png in cards
    content = content.replace(/Assest\/img\/Solo_Leveling\.jpg/g, 'Assest/img/Solo_Leveling.png');
    content = content.replace(/Assest\/img\/Frieren_Beyond_Journey's_End\.jpg/g, "Assest/img/Frieren Beyond Journey's End.png");
    content = content.replace(/Assest\/img\/Chainsaw_Man\.jpg/g, 'Assest/img/Chainsaw_Man.png');
    content = content.replace(/Assest\/img\/Spy_x_Family\.jpg/g, 'Assest/img/Spy_x_Family.png');
    content = content.replace(/Assest\/img\/Vinland_Saga\.jpg/g, 'Assest/img/Vinland_Saga.png');
    content = content.replace(/Assest\/img\/Bleach_Thousand_Year_Blood_War\.jpg/g, 'Assest/img/Bleach_TYBW.png');
    content = content.replace(/<img src="Assest\/img\/One_Piece_2\.png"/g, '<img src="Assest/img/One_Piece.png"');

    // 2. Revert the One Piece banner in index.html to placeholder
    content = content.replace(/background-image: url\('Assest\/img\/One_Piece_2\.png'\)/g, "background-image: url('https://placeholder.vn/placeholder/1920x800?bg=12121a&color=ff004f&text=One+Piece+Banner')");

    // 3. Replace all remaining placeholder.vn URLs for the cards
    for (const [text, imgPath] of Object.entries(mappings)) {
        // Match only exactly the text parameter in the placeholder URL
        const regexStr = 'https://placeholder\\.vn/placeholder/300x450\\?bg=[a-f0-9]+&color=[a-f0-9]+&text=' + text.replace(/\+/g, '\\+');
        const regex = new RegExp(regexStr, 'g');
        content = content.replace(regex, 'Assest/img/' + imgPath);
    }

    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
}
