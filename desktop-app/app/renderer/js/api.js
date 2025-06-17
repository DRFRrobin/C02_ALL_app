export async function readConfig(){
  return await window.api.readConfig();
}

export async function saveConfig(data){
  return await window.api.saveConfig(data);
}

export async function chooseFolder(){
  return await window.api.chooseFolder();
}
