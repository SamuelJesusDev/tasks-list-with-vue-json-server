import{Model as BaseModel} from 'vue-api-query';

export default class Model extends BaseModel{
baseURL(){
    return "http://localhost:3000";
}
// config da api vue-api-query
request(config){
    return this.$http.request(config);
}
}