var API = 
{
	language: "en",
	apiBaseUrl: "http://timfalken.com/hr/internetfornature/",
	
	login: function(email, password, onSuccess)
	{
		$.post(this.apiBaseUrl + "login.php", {Email:email, Password:password}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	registerNewUser: function (name, email, password, onSuccess)
	{
		$.post(this.apiBaseUrl + "users.php" + "?lang=" + this.language, {newUser:{Name:name, Email:email, Password:password}}, null, "JSON").done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	registerNewHistory: function (binId, weight, unixTimestamp, onSuccess)
	{
		$.post(this.apiBaseUrl + "history.php", {newStamp:{BinId:binId, Weight:weight, UnixTimestamp:unixTimestamp}}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	registerNewBin: function (ownerId, name, type, onSuccess)
	{
		$.post(this.apiBaseUrl + "bins.php" + "?lang=" + this.language, {newBin:{Name:name, OwnerId:ownerId, Type:type}}, null, "JSON").done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	getUser: function(userId, type, onSuccess) //types: info, points, bins, full
	{
		if(type == null)
			type = "info";
	
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "users.php?id=" + userId + "&type=" + type + "&lang=" + this.language,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getBinTypes: function(onSuccess)
	{
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "getTypes.php" + "?lang=" + this.language,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getAllUsers: function(type, onSuccess) //types: info, points, bins, full
	{
		if(type == null)
			type = "info";
			
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "users.php" + "?type=" + type + "&lang=" + this.language,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getBin: function(binId, onSuccess)
	{
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "bins.php?id=" + binId + "&lang=" + this.language,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getAllBins: function(onSuccess)
	{
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "bins.php" + "?lang=" + this.language,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getGlobalHistory: function(unixFrom, unixTo, onSuccess)
	{
		if(unixFrom == null)
			unixFrom = 0;
		
		if(unixTo == null)
			unixTo = 0;
	
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "history.php?from=" + unixFrom + "&to=" + unixTo,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getEntireHistory: function(binIds, onSuccess)
	{
		return this.getHistory(binIds, null, null, onSuccess);
	},
	
	getHistory: function(binIds, unixFrom, unixTo, onSuccess)
	{
		if(binIds == null)
			return null;
	
		if(unixFrom == null)
			unixFrom = 0;
		
		if(unixTo == null)
			unixTo = 0;
			
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "history.php" + "?id[]=" + binIds.join("&id[]=") + "&from=" + unixFrom + "&to=" + unixTo,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	awardPoints: function(id, pointObject, tokenStr, onSuccess)
	{
		$.post(this.apiBaseUrl + "awardPoints.php", {userId: id, points: pointObject, token: tokenStr}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	consumePoints: function(id, pointObject, tokenStr, onSuccess)
	{
		$.post(this.apiBaseUrl + "consumePoints.php", {userId: id, points: pointObject, token: tokenStr}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	editWeight: function(binId, weight, tokenStr, onSuccess)
	{
		$.post(this.apiBaseUrl + "updateBinWeight.php", {binId: binId, newWeight: weight, token: tokenStr}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	},
	
	editCharge: function(binId, charge, tokenStr, onSuccess)
	{
		$.post(this.apiBaseUrl + "updateBinCharge.php", {binId: binId, newCharge: charge, token: tokenStr}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	}
}