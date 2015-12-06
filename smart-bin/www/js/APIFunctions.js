var API = 
{
	apiBaseUrl: "http://timfalken.com/hr/internetfornature/",

	registerNewUser: function (name, email, password, onSuccess)
	{
		$.post(this.apiBaseUrl + "users.php", {newUser:{Name:name, Email:email, Password:password}}).done(function(data){
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
		$.post(this.apiBaseUrl + "bins.php", {newBin:{Name:name, OwnerId:ownerId, Type:type}}).done(function(data){
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
			url: this.apiBaseUrl + "users.php?id=" + userId + "&type=" + type,
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
			url: this.apiBaseUrl + "users.php" + "?type=" + type,
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
			url: this.apiBaseUrl + "bins.php?id=" + binId,
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
			url: this.apiBaseUrl + "bins.php",
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	getHistory: function(binId, unixFrom, unixTo, onSuccess)
	{
		if(binId == null)
			return null;
	
		if(unixFrom == null)
			unixFrom = 0;
		
		if(unixTo == null)
			unixTo = 0;
	
		return $.ajax({
			dataType: "JSON",
			method:"GET",
			url: this.apiBaseUrl + "history.php?id=" + binId + "&from=" + unixFrom + "&to=" + unixTo,
			success: function(data)
			{
				if (typeof onSuccess === "function")
					onSuccess(data);
			}	
		});
	},
	
	awardPoints: function(id, pointObject, onSuccess)
	{
		$.post(this.apiBaseUrl + "awardPoints.php", {userId: id, points: pointObject}).done(function(data){
			if (typeof onSuccess === "function")
				onSuccess(data);
		});
	}
}