// Jordan Stapinski
// Enigma Password Encryption JS file


function run_encryption(){
	$('#word_shift_text').removeAttr('hidden');
}

function run_start_modal(){
	$('#modal_encrypt').modal('open');
}

encrypt.addEventListener("click", run_encryption);
setTimeout(run_start_modal, 600);