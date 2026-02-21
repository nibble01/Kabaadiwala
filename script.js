
// Navigation
function showSection(id){
    let sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

let isLoginMode = true;

// Toggle Login / Register
function toggleAuth(){
    isLoginMode = !isLoginMode;

    document.getElementById("loginTitle").innerText = 
        isLoginMode ? "Login" : "Register";

    document.querySelector("#login button").innerText = 
        isLoginMode ? "Login" : "Register";

    document.getElementById("toggleText").innerText = 
        isLoginMode ? "Don't have an account?" : "Already have an account?";
}

// Handle Login / Register
function handleAuth(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let error = document.getElementById("errorMsg");

    if(email === "" || password === ""){
        error.innerHTML = "All fields are required!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(isLoginMode){
        // LOGIN
        let user = users.find(u => u.email === email && u.password === password);

        if(user){
            localStorage.setItem("loggedInUser", email);
            alert("Login Successful!");
            updateUI();
            checkProfile();
        } else {
            error.innerHTML = "Invalid email or password!";
        }

    } else {
        // REGISTER
        let userExists = users.find(u => u.email === email);

        if(userExists){
            error.innerHTML = "User already exists!";
            return;
        }

        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration Successful! Please login.");
        toggleAuth();
    }
}

// Logout
function logout(){
    localStorage.removeItem("loggedInUser");
    updateUI();
    showSection('home');
}

// Update Navbar UI
function updateUI(){
    let user = localStorage.getItem("loggedInUser");

    if(user){
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("profileBtn").style.display = "inline-block";

        let profile = JSON.parse(localStorage.getItem("profile_" + user));
        if(profile){
            updateNavbarName(profile.name);
        }

    } else {
        document.getElementById("loginBtn").style.display = "inline-block";
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("profileBtn").style.display = "none";
        document.getElementById("navTitle").innerHTML = "<b>KABADIWALA</b>";
    }
}
// Marketplace - Sell Item
let currentCard = null;
let currentPrice = 0;

function sellItem(button){

    currentCard = button.parentElement;

    let itemName = currentCard.querySelector("h3").innerText;
    let priceText = currentCard.querySelector("p").innerText;

    currentPrice = parseInt(priceText.replace("₹","").replace("/ kg",""));

    document.getElementById("sellItemName").innerText = itemName;
    document.getElementById("sellPricePerKg").innerText = currentPrice;

    document.getElementById("sellModal").style.display = "flex";
}

function calculateTotal(){
    let weight = document.getElementById("sellWeight").value;
    let total = weight * currentPrice;

    document.getElementById("sellTotal").innerText = total || 0;
}

function confirmSell(){

    let location = document.getElementById("sellLocation").value;
    let weight = document.getElementById("sellWeight").value;

    if(location === "" || weight === ""){
        alert("Please fill all details!");
        return;
    }

    alert("Pickup Scheduled!\nLocation: " + location +
          "\nWeight: " + weight + " kg" +
          "\nTotal: ₹" + document.getElementById("sellTotal").innerText);

    currentCard.remove();
    closeModal();
}

function closeModal(){
    document.getElementById("sellModal").style.display = "none";
    document.getElementById("sellLocation").value = "";
    document.getElementById("sellWeight").value = "";
    document.getElementById("sellTotal").innerText = "0";
}



// Show / Hide Add Form
function toggleForm(){
    let form = document.getElementById("addProductForm");
    form.style.display = form.style.display === "block" ? "none" : "block";
}

function addProduct(){
    let user = localStorage.getItem("loggedInUser");

if(!user){
    alert("Please login to add products!");
    showSection('login');
    return;
}
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let imageInput = document.getElementById("productImage");

    if(name === "" || price === "" || imageInput.files.length === 0){
        alert("Please fill all fields!");
        return;
    }

    let container = document.getElementById("productContainer");

    let newCard = document.createElement("div");
    newCard.classList.add("card");

    let imageURL = URL.createObjectURL(imageInput.files[0]);

    newCard.innerHTML = `
        <img src="${imageURL}" alt="${name}">
        <h3>${name}</h3>
        <p>₹${price} / kg</p>
        <button onclick="sellItem(this)">Sell</button>
    `;

    container.appendChild(newCard);

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    imageInput.value = "";

    alert("Product Added Successfully! ♻");
}
function togglePassword(){
    let passwordInput = document.getElementById("password");

    if(passwordInput.type === "password"){
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// Check if profile exists
function checkProfile(){
    let user = localStorage.getItem("loggedInUser");
    let profile = JSON.parse(localStorage.getItem("profile_" + user));

    if(profile){
        showSection('home');
        updateNavbarName(profile.name);
    } else {
        showSection('profile');
    }
}

    function saveProfile(){
    let name = document.getElementById("fullName").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let imageData = document.getElementById("profileImageInput").dataset.image;

    if(name === "" || phone === "" || address === ""){
        alert("Please fill all fields!");
        return;
    }

    let user = localStorage.getItem("loggedInUser");

    let existingProfile = JSON.parse(localStorage.getItem("profile_" + user)) || {};

    let profileData = {
        name: name,
        phone: phone,
        address: address,
        image: imageData || existingProfile.image || null
    };

    localStorage.setItem("profile_" + user, JSON.stringify(profileData));

    updateProfileUI(profileData);

    alert("Profile Saved Successfully!");
}

function updateProfileUI(profile){

    document.getElementById("profileNameHeading").innerText = profile.name;

    if(profile.image){
        document.getElementById("profileImagePreview").src = profile.image;
        document.getElementById("profileImagePreview").style.display = "block";
        document.getElementById("profileInitial").style.display = "none";
    } else {
        document.getElementById("profileInitial").innerText =
            profile.name.charAt(0).toUpperCase();

        document.getElementById("profileInitial").style.display = "block";
        document.getElementById("profileImagePreview").style.display = "none";
    }
}

function loadProfile(){
    let user = localStorage.getItem("loggedInUser");

    if(!user){
        alert("Please login first!");
        showSection('login');
        return;
    }

    let profile = JSON.parse(localStorage.getItem("profile_" + user));

    if(profile){
    document.getElementById("fullName").value = profile.name;
    document.getElementById("phone").value = profile.phone;
    document.getElementById("address").value = profile.address;

    updateProfileUI(profile);
}

    showSection('profile');
    if(profile){
    document.getElementById("profileInitial").innerText = profile.name.charAt(0).toUpperCase();
    document.getElementById("profileNameHeading").innerText = profile.name;
}
}
// Show name in navbar
function updateNavbarName(name){
    document.querySelector(".navbar b").innerText = "KABADIWALA - " + name;
}

function previewProfileImage(event){
    let reader = new FileReader();

    reader.onload = function(){
        let imageData = reader.result;

        document.getElementById("profileImagePreview").src = imageData;
        document.getElementById("profileImagePreview").style.display = "block";
        document.getElementById("profileInitial").style.display = "none";

        document.getElementById("profileImageInput").dataset.image = imageData;
    }

    reader.readAsDataURL(event.target.files[0]);
}