var doc, page, app, layer, layers, layerCount, userDefaults;

//Input variables
var horizontalInput;
var verticalInput;

function getUserDefaults() {
  return NSUserDefaults.alloc().initWithSuiteName("com.example.sketch.3641e459-8bc2-478e-b44e-cd1a6376e67");
}

function setAPIKeyInStorage(new_api_key) {
  var userDefaults = getUserDefaults();
  userDefaults.setObject_forKey(new_api_key, "yandex-api-key");
  userDefaults.synchronize();
  return true
}

function getAPIKeyFromStorage() {
  var userDefaults = getUserDefaults();
  return userDefaults.objectForKey("yandex-api-key");
}

function checkAPIKey() {
  var apiKey = getAPIKeyFromStorage();
  if (apiKey && apiKey.length() > 0) {
    return true;
  } else {
    return false;
  }
}

function initVars(context) {
  doc = context.document;
  app = [NSApplication sharedApplication];
  userDefaults = getUserDefaults();
}

function createWindow(context) {
  initVars(context);

  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setMessageText("Translate your artboard ")
  alert.addButtonWithTitle("Ok");
  alert.addButtonWithTitle("Cancel");

  // Create the main view
  var viewWidth = 400;
  var viewHeight = 140;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 33, (viewWidth - 100), 35));
  var horizontalLabel = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - 10, 20));
  var verticalLabel = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, (viewWidth / 2) - 10, 20));

  infoLabel.setStringValue("Check the language codes from goo.gl/DxdxqY");
  infoLabel.setSelectable(false);
  infoLabel.setEditable(false);
  infoLabel.setBezeled(false);
  infoLabel.setDrawsBackground(false);

  horizontalLabel.setStringValue("From:");
  horizontalLabel.setSelectable(false);
  horizontalLabel.setEditable(false);
  horizontalLabel.setBezeled(false);
  horizontalLabel.setDrawsBackground(false);

  verticalLabel.setStringValue("To:");
  verticalLabel.setSelectable(false);
  verticalLabel.setEditable(false);
  verticalLabel.setBezeled(false);
  verticalLabel.setDrawsBackground(false);

  view.addSubview(infoLabel);
  view.addSubview(horizontalLabel);
  view.addSubview(verticalLabel);

  horizontalTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20));
  verticalTextField = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20));
  [horizontalTextField setNextKeyView:verticalTextField];

  view.addSubview(horizontalTextField);
  view.addSubview(verticalTextField);

  return [alert];
}

function getHorizontalValue(context){
  var horizontalValue = userDefaults.objectForKey("horizontalInput");
  if(horizontalValue != undefined){
    return horizontalValue.toLowerCase();
  } else {
    return "en" // Default value
  }
}

function getVerticalValue(context){
  // Gets and returns saved setting
  // If there is no saved setting, return default
  var verticalValue = userDefaults.objectForKey("verticalInput");
  if(verticalValue != undefined){
    return verticalValue.toLowerCase();
  } else {
    return "id" // Default value = indonesian
  }
}

function customTranslate(context){
  var window = createWindow(context);
  var alert = window[0];
  var response = alert.runModal()

  if(response == "1000"){
    // Save horizontal textfield
    horizontalInput = horizontalTextField.stringValue();
    [userDefaults setObject:horizontalInput forKey:"horizontalInput"]; // Save to user defaults

    // Save vertical textfield
    verticalInput = verticalTextField.stringValue();
    [userDefaults setObject:verticalInput forKey:"verticalInput"]; // Save to user defaults

    var from_lang = getHorizontalValue(context);
    var to_lang = getVerticalValue(context);
    userDefaults.synchronize(); // save

    for (var l = 0; l< context.selection.length; l++){
      var contextnew = context.selection.objectAtIndex(l);
      translate_text(context, contextnew, from_lang, to_lang);
    }
  }
}

function userSetAPIKey(context) {
  askToEnterKey(context, false)
}

function translateTextPortugese(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","pt");
  }
}

function translateTextSpanish(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","es");
  }
  
}

function translateTextIndonesia(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","id");
  }
}

function translate_text(originalContext, context, fromLanguage , toLanguage){
  var text = "";
  var app = NSApplication.sharedApplication();

  var hasAPIKey = checkAPIKey()
  if (hasAPIKey) {
    var apiKey = getAPIKeyFromStorage();

    if (context.class() == "MSArtboardGroup" || (context.class() == "MSLayerGroup")) {
      var layers = context.children();
      translate_all_layers(layers, fromLanguage, toLanguage, apiKey)
    } else if (context.class() == "MSTextLayer") {
      var layer = context;
      translate_layer(layer, fromLanguage, toLanguage, apiKey)
    } else {
      app.displayDialog_withTitle("Can't be translated  🤔", "Umm, seems like this isn't a valid text layer!" +"\n" );
    }
  } else {
    var result = askToEnterKey(originalContext, true);
    if (result) {
      translate_text(originalContext, context, fromLanguage , toLanguage)
    } else {
      // app.displayDialog_withTitle("Please try again 💪", "This almost never happens!" +"\n" );
    }
  } 
}

function askToEnterKey(context, check) {
  var doc = context.document;
  var userInput = doc.askForUserInput_initialValue("Enter your Yandex API Key", "");
  if (check) {
    if (userInput && userInput.length() > 0) {
      return checkAndSaveYandexKey(userInput, check);
    } else {
      return generateYandexKeyError();
    }
  } else {
    return checkAndSaveYandexKey(userInput, check);
  }
}

function checkAndSaveYandexKey(userInput, check) {
  if (check) {
    var translation = translate("hello", "en", "id", userInput);
    if (translation == "halo") {
      return setAPIKeyInStorage(userInput);
    } else {
      return generateYandexKeyError();
    }
  } else {
    return setAPIKeyInStorage(userInput);
  }
}

function generateYandexKeyError() {
  var app = NSApplication.sharedApplication();
  app.displayDialog_withTitle("Your Yandex Key is not valid. Re-enter a valid one to continue 😋", "Houston, we have a problem!" +"\n" );
  return false
}

function translate_all_layers(layers, fromLanguage, toLanguage, apiKey) {
  for (var k = 0; k < layers.count(); k++) {
    var itemLayer = layers.objectAtIndex(k);
    translate_layer(itemLayer, fromLanguage, toLanguage, apiKey)
  }
}

function translate_layer(layer, fromLanguage, toLanguage, apiKey) {
  if ((layer.class() == "MSTextLayer")) {
    var textValue = layer.stringValue();
    var translatedText = translate(textValue, fromLanguage, toLanguage, apiKey);
    layer.stringValue = translatedText;
  }
}

function translate(textToTranslate, fromLang, toLang, apiKey) {
  var fromLanguage = fromLang;
  var toLanguage = toLang;

  //Translation key
  var textParam = "text=" + textToTranslate;
  var keyParam = "key=" + apiKey;

  var textToEncode = [NSString stringWithFormat:@"%@&%@", textParam, keyParam];
  var querySet = NSCharacterSet.URLQueryAllowedCharacterSet();
  var encodedString = [textToEncode stringByAddingPercentEncodingWithAllowedCharacters:querySet];
  var encodedTextParam = encodedString;
  var languageParam = "lang=" + fromLanguage + "-" + toLanguage;
  var queryURL = "https://translate.yandex.net/api/v1.5/tr.json/translate";
  queryURL = queryURL + "?";
  queryURL = queryURL + "&" + languageParam;
  queryURL = queryURL + "&" + encodedTextParam;

  var request = [NSMutableURLRequest new];
  [request setHTTPMethod:@"GET"];
  [request setURL:[NSURL URLWithString:queryURL]];
  var responseCode = null;
  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:nil];
  var response = [NSJSONSerialization JSONObjectWithData:oResponseData options:NSJSONReadingAllowFragments error:nil];
  var code = response["code"];

  if (code != "200") {
    return null
  }

  var responseList = response["text"]
  return responseList[0]
}
