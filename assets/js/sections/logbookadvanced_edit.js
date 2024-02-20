function editQsos() {
	var elements = $('#qsoList tbody input:checked');
	var nElements = elements.length;
	if (nElements == 0) {
		return;
	}
	var id_list=[];
	elements.each(function() {
		let id = $(this).first().closest('tr').data('qsoID')
		id_list.push(id);
	});

	$('#editButton').prop("disabled", true);

	$.ajax({
		url: base_url + 'index.php/logbookadvanced/editDialog',
		type: 'post',
		success: function (html) {
			BootstrapDialog.show({
				title: 'Batch edit for QSOs',
				size: BootstrapDialog.SIZE_WIDE,
				cssClass: 'options',
				nl2br: false,
				message: html,
				onshown: function(dialog) {
					prepareEditDialog();
				},
				buttons: [{
					label: 'Save',
					cssClass: 'btn-primary btn-sm',
					id: 'saveButton',
					action: function (dialogItself) {
						var column = $("#editColumn").val();
						if (column == 'date') {
							var value = $("#editDate").val();
							if (value.length == 0) {
								return;
							}
						}
						saveBatchEditQsos(id_list);

						$('#editButton').prop("disabled", false);
						$('#closeButton').prop("disabled", true);

						dialogItself.close();
					}
				},
				{
					label: lang_admin_close,
					cssClass: 'btn-sm',
					id: 'closeButton',
					action: function (dialogItself) {
						$('#editButton').prop("disabled", false);
						dialogItself.close();
					}
				}],
				onhide: function(dialogRef){
					$('#editButton').prop("disabled", false);
				},
			});
		}
	});
}

function prepareEditDialog() {
	$('#editDxcc').html($('#dxcc').html());
	$('#editDxcc option[value=""]').remove();

	$('#editIota').html($('#iota').html());

	$('#editStationLocation').html($('#de').html());
	$('#editStationLocation option[value="All"]').remove();
	$('#editStationLocation option:first').prop('selected', true);

	propagationCopy();

	/*
	Populate the Satellite Names in edit dropdown
	*/
	$.getJSON(base_url+"assets/json/satellite_data.json", function( data ) {

		// Build the options array
		var items = [];
		$.each( data, function( key, val ) {
			items.push(
				'<option value="' + key + '">' + key + '</option>'
			);
		});

		// Add to the datalist
		$('#editSatellite').append(items.join( "" ));
		var option = $('<option>');
		option.val('').text('-');
		$('#editSatellite').prepend(option);
		$('#editSatellite').val('').trigger('chosen:updated');
	});

	$('#editColumn').change(function(){
		var type = $('#editColumn').val();
		changeEditType(type);
	});

	$('#editDxccState').change(function(){
		var statedxcc = $('#editDxccState').val();
		changeState(statedxcc);
	});
}
function propagationCopy() {
	promise = fixPropagation().then(propAppend);
}

function fixPropagation() {
	d = new $.Deferred();
	$('#editPropagation').html($('#selectPropagation').html());
	$('#editPropagation option[value=""]').remove();
	d.resolve();
	return d.promise()
}

function propAppend() {
	d = new $.Deferred();
	var option = $('<option>');
	option.val('').text('-');
	$('#editPropagation').prepend(option);
	$('#editPropagation').val('').trigger('chosen:updated');
	d.resolve();
	return d.promise()
}

function saveBatchEditQsos(id_list) {
	var column = $("#editColumn").val();
	var value;
	var value2;

	if (column == 'cqz') {
		value = $("#editCqz").val();
	}
	if (column == 'dxcc') {
		value = $("#editDxcc").val();
	}
	if (column == 'iota') {
		value = $("#editIota").val();
	}
	if (column == 'state') {
		value = $("#editDxccStateList").val();
	}
	if (column == 'propagation') {
		value = $("#editPropagation").val();
	}
	if (column == 'station') {
		value = $("#editStationLocation").val();
	}
	if (column == 'date') {
		value = $("#editDate").val();
	}
	if (column == 'band') {
		value = $("#editBand").val();
		value2 = $("#editBandRx").val();
	}
	if (column == 'mode') {
		value = $("#editMode").val();
	}
	if (column == 'satellite') {
		value = $("#editSatellite").val();
	}
	if (column == 'sota' || column == 'pota' || column == 'wwff' || column == 'gridsquare' || column == 'comment' || column == 'operator' || column == 'qslvia') {
		value = $("#editTextInput").val();
	}

	$.ajax({
		url: base_url + 'index.php/logbookadvanced/saveBatchEditQsos',
		type: 'post',
		data: {
			ids: JSON.stringify(id_list, null, 2),
			column: column,
			value: value,
			value2: value2
		},
		success: function (data) {
			if (data != []) {
				$.each(data, function(k, v) {
					updateRow(this);
					unselectQsoID(this.qsoID);
				});
			}
		}
	});
}

function changeEditType(type) {
	$('#editCqz').hide();
	$('#editIota').hide();
	$('#editDxcc').hide();
	$('#editState').hide();
	$('#editPropagation').hide();
	$('#editStationLocation').hide();
	$('#editTextInput').hide();
	$('#editDate').hide();
	$('#editBand').hide();
	$('#editMode').hide();
	$('#editSatellite').hide();
	$('#editBandRx').hide();
	$('#editBandRxLabel').hide();
	$('#editDxccState').hide();
	$('#editDxccStateList').hide();
	$('#editDxccStateListLabel').hide();
	editDxccStateListLabel
	if (type == "dxcc") {
		$('#editDxcc').show();
	} else if (type == "iota") {
		$('#editIota').show();
	} else if (type == "cqz") {
		$('#editCqz').show();
	} else if (type == "state") {
		$('#editDxccState').show();
		$('#editDxccStateList').show();
		$('#editDxccStateListLabel').show();
	} else if (type == "propagation") {
		$('#editPropagation').show();
	} else if (type == "station") {
		$('#editStationLocation').show();
	} else if (type == "band") {
		$('#editBand').show();
		$('#editBandRx').show();
		$('#editBandRxLabel').show();
	}else if (type == "mode") {
		$('#editMode').show();
	} else if (type == "date") {
		$('#editDate').show();
	} else if (type == "satellite") {
		$('#editSatellite').show();
	} else if (type == "gridsquare" || type == "sota" || type == "wwff" || type == "operator" || type == "pota" || type == "comment" || type == "qslvia") {
		$('#editTextInput').show();
	}
}

function changeState(dxcc) {
	$('#editDxccStateList').empty();
	$.ajax({
		url: base_url + 'index.php/logbookadvanced/getSubdivisionsForDxcc',
		type: 'post',
		data: {
			dxcc: dxcc
		},
		success: function (data) {
			if (data != []) {
				// Build the options array
				var items = [];
				$.each( data, function( key, val ) {
					console.log(val);
					items.push(
						'<option value="' + val.state + '">' + val.state + ' - ' + val.subdivision + '</option>'
					);
				});

				// Add to the datalist
				$('#editDxccStateList').append(items.join( "" ));
			}
		}
	});
}
