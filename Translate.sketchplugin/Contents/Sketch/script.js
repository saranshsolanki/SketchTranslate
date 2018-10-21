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

  infoLabel.setStringValue("Check the language codes from: www.goo.gl/RNcvJ4");
  infoLabel.setAllowsEditingTextAttributes(true);

  infoLabel.setSelectable(true);
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
    return "ar" // Default value = indonesian
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

function translateTextChinese(context){
  for (var l = 0; l< context.selection.length; l++){

    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","zh");
  }
}

function translateTextKorean(context){
  for (var l = 0; l< context.selection.length; l++){

    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","ko");
  }
}

function translateTextGerman(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","de");
  }
  
}

function translateTextPortugese(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","pt");
  }
  
}
function translateTextRussian(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","ru");
  }
  
}
function translateTextSpanish(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","es");
  }
  
}


function translateTextArabic(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","ar");
  }

  var hasAPIKey = checkAPIKey();
  if (hasAPIKey) {
    reAlignArtboard (context);
  }
}

function translateTextHindi(context){
  for (var l = 0; l< context.selection.length; l++){
    var contextnew = context.selection.objectAtIndex(l);
    translate_text(context, contextnew, "en","hi");
  }

  var hasAPIKey = checkAPIKey();
  if (hasAPIKey) {
    reAlignArtboard (context);
  }
}

function translate_text(originalContext, context, fromLanguage , toLanguage){
  var text = "";
  var app = NSApplication.sharedApplication();

  var UI = require('sketch/ui');

  var hasAPIKey = checkAPIKey();
  if (hasAPIKey) {
    var apiKey = getAPIKeyFromStorage();

    if (context.class() == "MSArtboardGroup") {
      context.duplicate();
      context.frame().setX(context.frame().x() + context.frame().width() + 100);
      var layers = context.children();

      var artName = context.name();
      context.setName( artName + "_translated_to_" + toLanguage);

      translate_all_layers(layers, fromLanguage, toLanguage, apiKey);
      // UI.message("Success");
    }
    else if (context.class() == "MSLayerGroup") {
      var layers = context.children();
      translate_all_layers(layers, fromLanguage, toLanguage, apiKey);
      // UI.message("Success");
    }
    else if (context.class() == "MSTextLayer") {
      var layer = context;
      translate_layer(layer, fromLanguage, toLanguage, apiKey);
      // UI.message("Success");
    } else if (context.class() == "MSSymbolInstance") {
      var layer = context;
      translateSymbol(layer, fromLanguage, toLanguage, apiKey);
      // UI.message("Success");
    } else {
      UI.message("Not a valid text layer! Please try again 💪");
      // app.displayDialog_withTitle("Can't be translated  🤔", "Umm, seems like this isn't a valid text layer!" +"\n" );
    }
  } else {
    var result = askToEnterKey(originalContext, true);
    if (result) {
      translate_text(originalContext, context, fromLanguage , toLanguage)
    } else {
      // app.displayDialog_withTitle("Please try again 💪", "This almost never happens!" +"\n" );
      UI.message("Please try again 💪");
    }
  } 
}


function reAlignArtboard(context){

  var selection = context.selection;
  var count = selection.count();

  if (count != 0) {

    for (var i=0; i < count; i++) {
      if (selection[i].class() ==  "MSArtboardGroup") {
        
        var selectedArtboard = selection[i];
        var layer = selection[i];

        if(context.document.currentPage().deselectAllLayers){
            context.document.currentPage().deselectAllLayers();
        }else{
            context.document.currentPage().changeSelectionBySelectingLayers_([]);
        }

        selectedArtboard.select_byExpandingSelection(true, true);

        var artboardWidth = selectedArtboard.frame().width();

        var allArtboards = context.document.currentPage().artboards();

        var gutter = 100;

        for (var j = 0; j < allArtboards.count(); j++) {
          var artboard = allArtboards[j];

          if (artboard != selectedArtboard) {

            if (artboard.frame().y() == selectedArtboard.frame().y() && artboard.frame().x() > selectedArtboard.frame().x()) {
              artboard.frame().setX(artboard.frame().x() + artboardWidth + gutter);
            }

          }
        }

        selectedArtboard.deselectLayerAndParent();
        // selectedArtboard.duplicate();
        // selectedArtboard.frame().setX(selectedArtboard.frame().x() + selectedArtboard.frame().width() + gutter);
        selectedArtboard.deselectLayerAndParent();

        check_layers([layer layers]);

      }

    }

  }
}

function check_layers(layers){
  
  for (var x=0; x < [layers count]; x++) {
    
    var layer = layers[x];
    var layerClass = layer.class();
    var layerName = layer.name();

    var layerArtboard = layer.parentArtboard();
    var artboardFrame = layerArtboard.frame();
    var artX = artboardFrame.x();
    var artW = artboardFrame.width();

    if (layerClass == "MSShapeGroup") {
      
      rtl_move(layer, artX, artW);

    } else if (layerClass == "MSBitmapLayer") {
      
      rtl_move(layer, artX, artW);

    } else if (layerClass == "MSTextLayer") {
      
      rtl_move(layer, artX, artW);
      rtl_font(layer);

    } else if (layerClass == "MSSymbolInstance") {
      rtl_move(layer, artX, artW);

    } else if (layerClass == "MSSymbolMaster") {
      rtl_move(layer, artX, artW);

    } else if (layerClass == "MSArtboardGroup" || layerClass == "MSLayerGroup") {
      var sublayers = [layer layers];
      check_layers(sublayers);
    }
    [layer select:false byExpandingSelection:true]

  }
}

function rtl_move(layer, artX, artW) {
  
  var layerFrame = layer.frame();
  var layerAbsoluteRect = layer.absoluteRect();

  var absLayerXpos = layerAbsoluteRect.x();
  var layerWidth = layerAbsoluteRect.width();

  var trueX = (absLayerXpos - artX);

  var widthAndPos = (parseInt(layerWidth) + parseInt(trueX));

  var newLayerXpos = (artW - widthAndPos);

  var difference = (newLayerXpos - trueX);

  layerAbsoluteRect.setX(absLayerXpos + difference);
}

function rtl_font(layer) {

  var layer = layer;

  var fontPS = [layer fontPostscriptName];

  var ifht = new Object();
  ifht["MaterialIcons-Regular"] = true;

  layer.setTextAlignment(1);

  var layerValue = String(layer.stringValue());
    if (ifht[fontPS]) {
      if(ht[layerValue]) {
        layer.setIsFlippedHorizontal(true);
      } else {
      }
  }
}

function askToEnterKey(context, check) {
  var doc = context.document;
  var userInput = doc.askForUserInput_initialValue("Enter Yandex API Key | get it from 'goo.gl/A6AM9f'",  "");

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
  var UI = require('sketch/ui'); 

  if ((layer.class() == "MSTextLayer")) {
    var textValue = layer.stringValue();
    var textValueNew = textValue;
    var numberCaps = textValue.replace(/[^A-Z]/g, "").length;

    var translatedText = translate(textValue, fromLanguage, toLanguage, apiKey);
      
    // check for localization rules
    if((toLanguage == "ko" || toLanguage == "zh" || toLanguage =="ja")){
      var validFont = false;
      var validWeight = true;
      var text = "❤ Localization rules followed ❤";

      if((layer.isVisible()!=0) && (layer.fontSize()>= 12)){
        validFont = true;
      }
      
      var layerFontName = layer.fontPostscriptName();
      // log("layerFontName:" +layerFontName);

      if( layerFontName.includes("Italic") || (layerFontName.includes("italic"))){
        validWeight = false;
      }

      if ((!validFont) || (!validWeight)) {
        text = "Localization Issue";

        if(!validWeight){
          text = text + " | Avoid italics";
        }

        if(!validFont){
          text = text + " | Font size shouldn't be less than 12";

          var fontWeight = NSFontManager.sharedFontManager().weightOfFont_(layer.font());
          if (fontWeight >=9){
            text = text + " | Avoid bold with small fontsize";
          }
        }

        layer.style().addStylePartOfType(1);
        layer.style().borders().objectAtIndex(0).setThickness(4);
        layer.style().borders().objectAtIndex(0).color().setRed(0.8862745098);
        layer.style().borders().objectAtIndex(0).color().setGreen(0.06666666667);
        layer.style().borders().objectAtIndex(0).color().setBlue(0.06666666667);
      }

      UI.message(text);
    }

    layer.stringValue = translatedText;

  }

  if((layer.class() == "MSSymbolMaster")){
    var sublayers = layer.layers();

    for (var i=0; i< sublayers.count(); i++){
      var sublayer = sublayers.objectAtIndex(i);
      translate_layer(sublayer, fromLanguage, toLanguage, apiKey);
    }
  }

  if((layer.class() == "MSSymbolInstance")){
    translateSymbol(layer, fromLanguage, toLanguage, apiKey);
  }
}

function translateSymbol(layer,fromLanguage, toLanguage, apiKey){
  var existingOverrides = layer.overrides() || NSDictionary.dictionary(); 
  var overrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);
  var keys = overrides.allKeys();

  for (var i = 0; i < keys.count(); i++) {
    var index = keys.objectAtIndex(i);
    if(overrides[index].class().isSubclassOfClass_(NSMutableDictionary.class()) ) {
        overrides[index] = searchInSymbolsInception(overrides[index], fromLanguage, toLanguage, apiKey);
    
    } else if(overrides[index].class().isSubclassOfClass_(NSString.class()) ) {
        overrides[index] = translate(overrides[index], fromLanguage, toLanguage, apiKey);
    }
  }
  layer.overrides = overrides;
}

function searchInSymbolsInception(overrides, fromLanguage, toLanguage, apiKey) {
  var keys = overrides.allKeys();

  for (var i = 0; i < keys.count(); i++) {

    var index = keys.objectAtIndex(i);

    if(overrides[index].class().isSubclassOfClass_(NSMutableDictionary.class()) ) {
        overrides[index] = searchInSymbolsInception(overrides[index], fromLanguage, toLanguage, apiKey);

    } else if(overrides[index].class().isSubclassOfClass_(NSString.class()) ) {
        overrides[index] = translate(overrides[index], fromLanguage, toLanguage, apiKey);
    }
  }
  return overrides;
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
