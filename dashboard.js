import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";



//CURRENCY CONVERTER FROM USD TO NGN
const getNGNrate = async () => {
    const API_URL = 'https://open.er-api.com/v6/latest/USD';
    try {
        const currencyResponse = await fetch(API_URL);
        const currencyData = await currencyResponse.json();
        // console.log(currencyData);
        const ngnRate = Math.round(currencyData.rates.NGN);
        NGNrate = ngnRate;

    } catch (error) {
        console.error("Failed to fetch current rate. Falling back to default.", error);
    }
}

//GLOBAL VARIABLES
var selectedTourPackage = null;
var userEmail;
var NGNrate;
var nairaAmount = 0;

// TRIGGERING THE NGNrate FUNCTION ON LOAD OF THE PAGE
getNGNrate();



//FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyD2yk67GsHakRcoPY9JWI6XlgFntCsQomQ",
    authDomain: "afrivista-tourism.firebaseapp.com",
    projectId: "afrivista-tourism",
    storageBucket: "afrivista-tourism.firebasestorage.app",
    messagingSenderId: "1042806811109",
    appId: "1:1042806811109:web:4e5ad306fb3dc429c3270c"
};

//GETTING INFO OF SIGNED-IN USER FROM FIREBASE
const API_KEY = '379566d16fd74a96857130225261207'
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;

onAuthStateChanged(auth, (user) => {
    if (user) {

        if (user !== null) {
            user.providerData.forEach((profile) => {
                // console.log("Sign-in provider: " + profile.providerId);
                // console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                // console.log("  Photo URL: " + profile.photoURL);
                const email = user.email
                userEmail = email
                // console.log( userEmail);
                document.getElementById('show').innerHTML = `${user.displayName}`
            });
        }

    } else {
        window.location.href = 'signin.html'
        // User is signed out
        // ...
    }
});


//TOUR PACKAGES
const tourPackages = [
    {
        title: 'Pyramids of Giza and Luxor Temples',
        country: 'Egypt',
        duration: '5 days',
        accommodation: '4-Star Cairo Hotel',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=500 '
    },
    {
        title: "Algiers Historic Casbah Tour",
        country: "Algeria",
        price: 1450,
        duration: "5 Days",
        accommodation: "Boutique Riad",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/f6/81/6b/caption.jpg?w=1200&h=-1&s=1"
    },
    {
        title: "Table Mountain & Cape Town Getaway",
        country: 'South Africa',
        duration: '4days',
        accommodation: "Oceanfront Boutique Inn",
        price: 1100,
        image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQ5UL4g60ekylRe0zASNDBc0VP04IrL_4FNRQDsclqIFpbmDw-OI4jroOA16B1c3_ExgJXHWKCKm_RDMV8"
    },
    {
        title: "Serengeti National Park Safari",
        country: 'Tanzania',
        duration: '5 days',
        accommodation: "Luxury Eco-Lodge",
        price: 1200,
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500"
    },
];

// HTML TEMPLATE FOR TOUR PACKAGES
const tourContainer = document.getElementById('tours-container');

if (tourContainer) {
    tourContainer.innerHTML = '';
} else {
    console.log('error');
}

for (let i = 0; i < tourPackages.length; i++) {
    const element = tourPackages[i];
    // console.log(element.country);
    const htmlTemplate = `
    <div class="card border-1 shadow-sm bg-dark-subtle overflow-hidden rounded-end-pill">
        <div class="row g-0">
            
        
            <div class="col-12 col-sm-4">
                <img src="${element.image}" class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 150px; max-height: 200px;" alt="${element.title}">
            </div>
            
            
            <div class="col-12 col-sm-8">
                <div class="card-body p-4 d-flex flex-column h-100 justify-content-between">
                    
                <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold text-dark mb-0" style="font-size: 1.05rem; line-height: 1.3;">${element.title}</h5>
                <span class="badge bg-light text-secondary border text-uppercase px-2 py-1 ms-2" style="font-size: 0.65rem;">
                ${element.country}
                </span>
                        </div>
                        
                        
                        <div class="d-flex gap-3 text-muted small mb-3">
                            <span><i class="bi bi-clock me-1"></i>${element.duration}</span>
                            <span>•</span>
                            <span><i class="bi bi-house-door me-1"></i>${element.accommodation}</span>
                        </div>
                    </div>

                    
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div>
                            <small class="text-muted d-block" style="font-size: 0.7rem;">Package Price</small>
                            <span class="fw-bold text-success fs-5">$${element.price}</span>
                        </div>
                        <button class="btn btn-primary btn-sm rounded-pill px-4 fw-semibold shadow-sm exploreButton" >
                        Explore
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>`
    tourContainer.innerHTML += htmlTemplate;
}

//ACTIVATION OF EACH "EXPLORE" BUTTON
const buttons = document.querySelectorAll('.exploreButton');

for (let i = 0; i < buttons.length; i++) {
    const btnElement = buttons[i];
    btnElement.addEventListener('click', () => {
        selectedTourPackage = tourPackages[i];
        console.log(selectedTourPackage.country);
        getWeatherInfo(selectedTourPackage.country)
        amountInNaira(selectedTourPackage.price)
    })

}


// WEATHER API FOR EACH TOUR LOCATION
async function getWeatherInfo(country) {
    const temp = document.getElementById('dashTemp');
    const weatherCondition = document.getElementById('dashCondition');
    const displayCity = document.getElementById('cityName');
    const icon = document.getElementById('weatherIcon');

    const CITY = country;
    const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}`;

    const response = await fetch(URL);

    if (!response.ok) {
        console.log(response);
    }
    else {
        const weatherData = await response.json();
        // console.log(weatherData);
        // console.log(weatherData.location.name);
        // console.log(weatherData.current.temp_c);
        // console.log(weatherData.current.condition.text);

        temp.innerHTML = `${Math.round(weatherData.current.temp_c)}°C`
        weatherCondition.innerHTML = `${weatherData.current.condition.text}`
        displayCity.innerHTML = `${weatherData.location.name}`
        icon.src = `https:${weatherData.current.condition.icon}`
        btnCheckout.disabled = false;
    }
};


// CURRENCY CONVERSION TO NAIRA
function amountInNaira(usdPrice) {
    var convertedNGN = document.getElementById('convertedAmount');
    const amountInNaira = NGNrate * usdPrice;
    console.log(amountInNaira);

    nairaAmount = amountInNaira;
    convertedNGN.innerHTML = `₦${nairaAmount.toLocaleString()}`;
}


// CHECKOUT - PAYSTACK API
const btnCheckout = document.getElementById('checkoutBtn');
btnCheckout.disabled = true;

btnCheckout.addEventListener('click', () => {
    const amountInKobo = nairaAmount * 100;
    // console.log(amountInKobo);
    const paystack = new PaystackPop();

    paystack.newTransaction({
        key: 'pk_test_ddbd6e87c046502c1e7e97b258f8032a54cf51fe',
        email: userEmail,
        amount: amountInKobo,
        onSuccess: (transaction) => {
            console.log(transaction.status,transaction);
            generateReceipt(transaction.reference);
        },
        onLoad: (response) => {
            console.log("onLoad: ", response);
        },
        onCancel: () => {
            console.log("onCancel");
        },
        onError: (error) => {
            console.log("Error: ", error.message);
        }
    })
})


//PAYMENT RECEIPT
function generateReceipt(transactionRef){
    document.getElementById('receiptTourTitle').innerText = selectedTourPackage.title;
    document.getElementById('receiptCountry').innerText = selectedTourPackage.country;
    document.getElementById('receiptDuration').innerText = selectedTourPackage.duration;
    document.getElementById('receiptEmail').innerText = userEmail;
    document.getElementById('receiptUSDPrice').innerText = selectedTourPackage.price;
    document.getElementById('c').innerText = nairaAmount;
    document.getElementById('receiptRef').innerText = transactionRef;

    //BOOTSTRAP MODAL POPUP
    const targetModalNode = document.getElementById('receiptModal');
    const bootstrapReceiptInstance = new bootstrap.Modal(targetModalNode);
    bootstrapReceiptInstance.show();
}


//SIGNOUT/LOGOUT
document.getElementById('logoutBtn').addEventListener('click', ()=>{
    
    signOut(auth).then(() => {
        console.log('Sign-out successful');
        window.location.href = 'signin.html'

    
    }).catch((error) => {
      // An error happened.
        errorMessage = error.message;
        errorCode = error.code;
        console.log(errorMessage);
        console.log(errorCode);
    });
});



