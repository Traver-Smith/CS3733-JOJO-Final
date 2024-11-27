export const handler = async (event) => {
    if(!event){
      return{
        statusCode: 400,
        body: JSON.stringify('No Input')
        }
    }
    else{
     if (event.username == 'admin' && event.password == 'jojosiwa'){
        return {
        statusCode: 200,
        body: JSON.stringify('Success')
        }
      }
      else{
        return{
        statusCode: 201,
        body: JSON.stringify('Invalid credentials!')
        }
      }
    }
  };
  