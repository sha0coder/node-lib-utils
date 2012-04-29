#!/usr/bin/env node

//Extract all dns on files at same directory
//mail: sha0@badchecksum.net
//twitter: @sha0coder

var fs = require('fs');

var dns_url = /:\/\/([a-zA-Z0-9.-]+)/g;
var dns_pure = /(www.[a-zA-Z0-9.-]+)/g;
var dns_email = /@[a-zA-Z0-9.-]+/g;
var dns_tld = /([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/g;


var tlds = ['AC','AD','AE','AERO','AF','AG','AI','AL','AM','AN','AO','AQ','AR','ARPA','AS','ASIA','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BIZ','BJ','BM','BN','BO','BR','BS','BT','BV','BW','BY','BZ','CA','CAT','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','COM','COOP','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EDU','EE','EG','ER','ES','ET','EU','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GOV','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IM','IN','INFO','INT','IO','IQ','IR','IS','IT','JE','JM','JO','JOBS','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MG','MH','MIL','MK','ML','MM','MN','MO','MOBI','MP','MQ','MR','MS','MT','MU','MUSEUM','MV','MW','MX','MY','MZ','NA','NAME','NC','NE','NET','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','ORG','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PRO','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','ST','SU','SV','SX','SY','SZ','TC','TD','TEL','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TP','TR','TRAVEL','TT','TV','TW','TZ','UA','UG','UK','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','XXX','YE','YT','ZA','ZM','ZW'];



function hasTLD(name) {
	var valid = true;
	name = name.toUperCase();
	tlds.forEach(function (tld)  {	
		if ((name.substr(-tld.length)) == tld[i]) 
			return true;
	});
	return false;
}

function findNames(data,out,callback) {
	var dns;

	while (dns = dns_tld.exec(data)) {
		if (hasTLD(dns[1])
			out.write(dns[1]+'\n');
	}

	callback();
}

function main() {
	var out = fs.createWriteStream('names');
	
	out.on('error', function(err) {
		console.log(err);
	});

	fs.readdir(__dirname, function(err, files) {
		var count = files.length-2;
		console.log('Parsing %d files',count);
		
		files.forEach(function(file) {
			
			
			if (file != 'dnsExtractor.js' && file != 'names')
				fs.readFile(file, function(err, data) {
					findNames(data.toString(),out,function() {
						count--;
						console.log('launching callback %d pending.',count);
						if (count<=0) {
							out.end();
							console.log('Closing file');
						}
					});
				});
		});
	});



}




main();
