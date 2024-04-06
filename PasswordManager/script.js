function maskPassword(pass) {
    const key = CryptoJS.enc.Utf8.parse('thats my kung fu');
    const encryptedPassword = CryptoJS.AES.encrypt(pass, key, { mode: CryptoJS.mode.ECB }).toString();
    return encryptedPassword;
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

function copyTextDecrypt(pass) {
    // Get the encrypted password from the passed argument
    const encryptedPassword = document.getElementById(pass).innerText;

    // Decrypt the password using CryptoJS
    const key = CryptoJS.enc.Utf8.parse('thats my kung fu');
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);

    // Copy the decrypted password to the clipboard
    navigator.clipboard.writeText(decryptedPassword).then(
        () => {
            /* clipboard successfully set */
            document.getElementById("alert").style.display = "inline";;
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            /* clipboard write failed */
            alert("Clipboard copying failed");
        }
    );
}


const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => {
        return e.website !== website;
    });
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully deleted ${website}'s password`);
    showPasswords();
};

const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (data === null || JSON.parse(data).length === 0) {
        tb.innerHTML = "No Data To Show";
    } else {
        tb.innerHTML = `<tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Delete</th>
    </tr> `;
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];

            str += `<tr>
    <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" height="10">
    </td>
    <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" height="10">
    </td>
    <td><span id="password_${index}">${maskPassword(element.password)}</span> <img onclick="copyTextDecrypt('password_${index}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>

    </td>
    <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
        </tr>`;
        }
        tb.innerHTML += str;
    }
    document.getElementById("website").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
};

console.log("Working");
showPasswords();

document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let passwords = localStorage.getItem("passwords");
    if (passwords === null) {
        let json = [];
        json.push({ website: website, username: username, password: password });
        alert("Password Saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    } else {
        let json = JSON.parse(passwords);
        json.push({ website: website, username: username, password: password });
        alert("Password Saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    }
    showPasswords();
});
