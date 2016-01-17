  riskCollection =  new Mongo.Collection(null);
 data = [
	{
		"Label": "magna. Lorem ipsum dolor sit amet, consectetuer adipiscing",
		"Text": "dictum sapien. Aenean massa. Integer",
		"Frequency": 25,
		"Measure": "B6L 7O5",
		"Property": "dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam"
	},
	{
		"Label": "Sed eget lacus. Mauris non dui nec urna",
		"Text": "nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed et libero. Proin",
		"Frequency": 19,
		"Measure": "Z3R 8D0",
		"Property": "posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem"
	},
	{
		"Label": "tempus eu, ligula. Aenean euismod mauris eu elit.",
		"Text": "sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum",
		"Frequency": 41,
		"Measure": "E8B 1J5",
		"Property": "ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet"
	},
	{
		"Label": "malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus",
		"Text": "Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae",
		"Frequency": 38,
		"Measure": "K8N 5S7",
		"Property": "dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum"
	},
	{
		"Label": "ultrices, mauris ipsum porta elit, a feugiat tellus",
		"Text": "Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed",
		"Frequency": 13,
		"Measure": "E6W 3O4",
		"Property": "vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris"
	},
	{
		"Label": "malesuada fames ac turpis egestas. Fusce aliquet magna",
		"Text": "Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum.",
		"Frequency": 21,
		"Measure": "E9Z 5V3",
		"Property": "magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque"
	},
	{
		"Label": "Nullam suscipit, est ac facilisis facilisis, magna tellus",
		"Text": "Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante",
		"Frequency": 40,
		"Measure": "N1C 0I7",
		"Property": "tincidunt congue"
	},
	{
		"Label": "sociosqu ad litora torquent per conubia nostra, per",
		"Text": "Aenean euismod mauris eu elit. Nulla facilisi. Sed neque.",
		"Frequency": 5,
		"Measure": "Y1P 3P1",
		"Property": "magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc"
	},
	{
		"Label": "magna tellus faucibus leo, in lobortis tellus justo",
		"Text": "massa. Suspendisse eleifend. Cras sed leo. Cras vehicula",
		"Frequency": 38,
		"Measure": "K5Y 4G9",
		"Property": "lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet"
	},
	{
		"Label": "Phasellus at augue id ante dictum cursus. Nunc",
		"Text": "nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros",
		"Frequency": 27,
		"Measure": "S1K 3M0",
		"Property": "a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus"
	},
	{
		"Label": "Nullam lobortis quam a felis ullamcorper viverra. Maecenas",
		"Text": "eu, ligula. Aenean euismod mauris eu elit.",
		"Frequency": 27,
		"Measure": "U7E 1P5",
		"Property": "ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor,"
	},
	{
		"Label": "est mauris, rhoncus id, mollis nec, cursus a,",
		"Text": "eu, placerat eget, venenatis",
		"Frequency": 16,
		"Measure": "K9W 3J3",
		"Property": "luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor"
	},
	{
		"Label": "vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis",
		"Text": "auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum",
		"Frequency": 37,
		"Measure": "T5I 1P6",
		"Property": "Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec,"
	},
	{
		"Label": "sem egestas blandit. Nam nulla magna, malesuada vel,",
		"Text": "arcu ac orci. Ut semper pretium",
		"Frequency": 24,
		"Measure": "K7V 3G7",
		"Property": "neque vitae semper egestas, urna"
	},
	{
		"Label": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
		"Text": "sit amet ultricies sem",
		"Frequency": 35,
		"Measure": "P3F 9W3",
		"Property": "dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim, gravida sit amet,"
	},
	{
		"Label": "Etiam gravida molestie arcu. Sed eu nibh vulputate",
		"Text": "Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad",
		"Frequency": 4,
		"Measure": "V7T 5R4",
		"Property": "Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam"
	},
	{
		"Label": "non justo. Proin non massa non ante bibendum",
		"Text": "nostra, per inceptos",
		"Frequency": 49,
		"Measure": "E8J 2O1",
		"Property": "velit. Sed malesuada augue ut lacus."
	},
	{
		"Label": "purus. Duis elementum, dui quis accumsan convallis, ante",
		"Text": "ipsum nunc id",
		"Frequency": 14,
		"Measure": "T3Y 7A6",
		"Property": "at fringilla purus mauris a nunc. In at pede. Cras vulputate velit"
	}
];

if(riskCollection.find({}).count() == 0){
	data.forEach(function (item) {
		console.log(item)
		 riskCollection.insert(item);

	});
}
Meteor.publish("riskCollection", function(){

return riskCollection.find({});

})

Meteor.methods({
'getData':function(){
	return riskCollection.find({}).fetch()
}
})