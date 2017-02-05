$(document).ready(function () {
    $('select').material_select();

    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
    $('#login_header>span, #login_instead').click(function () {
        $('#login_header > span').toggleClass('active');
        $('#login_box, #signup_box').toggleClass('fadeInUp fadeOutLeft hide');
    });
    // views swap
    $('#show_leaderboard').click(function () {
        $('section.view').addClass('hide');
        $('#leaderboard_view').removeClass('hide');
        $('#leaderboard_view').addClass('fadeInDown');
    });
    $('#go_home,a.brand-logo').click(function () {
        $('section.view').addClass('hide');
        $('#home_view').removeClass('hide');
        $('#home_view').addClass('fadeInDown');
    });
    $('#show_profile').click(function () {
        $('section.view').addClass('hide');
        $('#userProfile_view').removeClass('hide');
        $('#userProfile_view').addClass('fadeInDown');
    });
    $('#show_settings').click(function () {
        $('section.view').addClass('hide');
        $('#settings_view').removeClass('hide');
        $('#settings_view').addClass('fadeInDown');
    });
    // exam swap
    $('#select_jamb_from_home').click(function () {
        $('section.view').addClass('hide');
        $('#select_jamb_subject_view').removeClass('hide');
        $('#select_jamb_subject_view').addClass('fadeInDown');
    });
    $('#select_waec_from_home').click(function () {
        alert('WAEC is not yet ready yet. This is just a demo. kindly select jamb');
    });

    $('#nextQuestion').click(function(){
        $('section.view').addClass('hide');
        $('#jamb_inProgress_view').removeClass('hide');
        $('#jamb_inProgress_view').addClass('fadeInDown');
    });

    $('#startAgain').click(function(){
        $('section.view').addClass('hide');
        $('#select_jamb_subject_view').removeClass('hide');
        $('#select_jamb_subject_view').addClass('fadeInDown');
    });

    $('#startJamb').click(function(){
        $('section.view').addClass('hide');
        $('#jamb_inProgress_view').removeClass('hide');
        $('#jamb_inProgress_view').addClass('fadeInDown');
    });

    $('#submitExam').click(function(){
        $('section.view').addClass('hide');
        $('#exam_summary_view').removeClass('hide');
        $('#exam_summary_view').addClass('fadeInDown');
    })
    // exam swap

    // views swap
    //
});

var config = {
    apiKey: "AIzaSyBqsSR7guS2Rjs2KdDb9ZWPm0efD6z-RE8",
    authDomain: "learn2succeed-8017a.firebaseapp.com",
    databaseURL: "https://learn2succeed-8017a.firebaseio.com",
    storageBucket: "learn2succeed-8017a.appspot.com",
    messagingSenderId: "790540855811"
};

firebase.initializeApp(config);

var auth = firebase.auth(),
    database = firebase.database(),
    rootRef = database.ref();

var usersRef = rootRef.child('users'),
    examsRef = rootRef.child('exams'),
    subjectsRef = rootRef.child('subjects'),
    scoresRef = rootRef.child('scores');

var login_tries_error_limit = 0,
    currentTimer = null;

function do_login() {
    var email = $('#email_login').val();
    var password = $('#password_login').val();
    $('.loading-icon').removeClass('hide');

    if (email.length < 4) {
        $('.loading-icon').addClass('hide');
        Materialize.toast('Please enter a valid email', 4000, 'rounded');
        return;
    }
    if (password.length < 4) {
        $('.loading-icon').addClass('hide');
        Materialize.toast('Please enter a valid password', 4000, 'rounded');
        return;
    }

    function nowLogin() {
        auth.signInWithEmailAndPassword(email, password).then(function () {
            $('.loading-icon').addClass('hide');
            showPromoters();
            showEvents();
            showClubs();
            showCities();
            showbottles();
            showusers();
            // showstats();
            $('#email_login').val('');
            $('#password_login').val('');
            if (!auth.currentUser.emailVerified) {
                auth.currentUser.sendEmailVerification();
            }
            if (auth.currentUser.displayName) {
                Materialize.toast('Welcome ' + auth.currentUser.displayName + '!', 4000, 'rounded');
                return false;
            } else {
                Materialize.toast('Welcome!', 3000, 'rounded');
                return false;
            }
        }, function (error) {
            login_tries_error_limit += 1;
            if (login_tries_error_limit < 4) {
                nowLogin();
            } else {
                $('.loading-icon').addClass('hide');
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    Materialize.toast('Wrong password', 4000, 'rounded');
                } else {
                    Materialize.toast(errorMessage, 4000, 'rounded');
                }
                if (error.message === "The email address is badly formatted") {
                    Materialize.toast("please enter a valid email", 4000, 'rounded');
                }
                // console.log(error.message);
            }
        });
        return false;
    }
    nowLogin();

}

function do_signUp() {
    $('.loading-icon').removeClass('hide');
    var emailtxt = $('#email_signup').val();
    var fullnametxt = $('#fullname_signup').val();
    var passwordtxt = $('#password_signup').val();


    if (emailtxt.length < 4 || emailtxt.length === 0) {
        $('.loading-icon').addClass('hide');
        Materialize.toast('Please enter a valid email address', 4000, 'rounded');
        return;
    }
    if (passwordtxt.length < 4 || passwordtxt.length === 0) {
        $('.loading-icon').addClass('hide');
        Materialize.toast('Please enter a valid password', 4000, 'rounded');
        return;
    }

    auth.createUserWithEmailAndPassword(emailtxt, passwordtxt).then(function () {
        $('.loading-icon').addClass('hide');
        Materialize.toast('Registration successful!', 3000, 'rounded');
        auth.currentUser.updateProfile({
            displayName: fullnametxt
        }).then(function () {
            var currentUser_email = auth.currentUser.email;
            var currentUser_uid = auth.currentUser.uid;
            var new_user_info = {
                fullname: fullnametxt,
                email: emailtxt
            };
            usersRef.child(currentUser_uid).set(new_user_info).then(function () {
                $('.loading-icon').addClass('hide');
                Materialize.toast('Please check your email to verify your membership', 3000, 'rounded');
                if (!auth.currentUser.emailVerified) {
                    auth.currentUser.sendEmailVerification();
                }
            }, function (error) {
                $('.loading-icon').addClass('hide');
                Materialize.toast(error.message, 5000, 'rounded');
                // console.log(error.message);
            });
        }, function (error) {
            $('.loading-icon').addClass('hide');
            Materialize.toast(error.message, 5000, 'rounded');
            // console.log(error.message);
        });
    }).catch(function (error) {
        $('.loading-icon').addClass('hide');
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            Materialize.toast('The password is too weak', 4000, 'rounded');
        } else {
            Materialize.toast(errorMessage, 5000, 'rounded');
        }
        // console.log(error);
    });
}

// function sendPasswordReset() {
// 	$('#pass_reset .loading-icon').removeClass('hide');
// 	var email = $('#email_to_reset').val();
// 	if (email.length < 4) {
// 		$('#pass_reset .loading-icon').addClass('hide');
// 		Materialize.toast('Please enter your email address', 4000, 'rounded');
// 		return;
// 	}
// 	auth.sendPasswordResetEmail(email).then(function () {
// 		$('#pass_reset .loading-icon').addClass('hide');
// 		$('form#login_container').removeClass('hide');
// 		$('form#pass_reset').addClass('hide');
// 		Materialize.toast('Password reset email will be sent to ' + email + ' shortly!', 7000, 'rounded');
// 	}).catch(function (error) {
// 		$('#pass_reset .loading-icon').addClass('hide');
// 		$('form#login_container').removeClass('hide');
// 		$('form#pass_reset').addClass('hide');
// 		var errorMessage = error.message;
// 		Materialize.toast(errorMessage, 5000, 'rounded');
// 		// console.log(error);
// 	});
// }

$('#user_logout').click(function () {
    auth.signOut().then(function () {
        Materialize.toast("Thank you!, Wish to see you again", 4000);
    }, function (error) {
        Materialize.toast(error, 4000);
        // console.log('failed to sign out \n here is what happened: \n ' + error.message);
    });
});

auth.onAuthStateChanged(function (user) {
    if (user && (user !== null)) {
        $('#auth_splash').addClass('hide');
        $('#main_app_body').removeClass('hide fadeIn');
        $('#main_app_body').addClass('fadeIn');
        $('body').removeClass('inactive');
        $('#bhl>span, #fullname_on_profile_view').text(user.displayName);
    } else {
        $('#auth_splash').removeClass('hide');
        $('#auth_splash').addClass('fadeIn');
        $('#main_app_body').addClass('hide');
        $('#main_app_body').removeClass('fadeIn');
    }
});