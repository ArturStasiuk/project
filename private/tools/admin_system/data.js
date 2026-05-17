class Data 
{ 
    
    constructor(parent)
    {
      //this.url = './php/admin_system.php';  
    }

    async fetchData(data){
        if (!data || typeof data !== 'object' || !('url' in data) || !('method' in data) || !('args' in data)) {
            return {
                status: false,
                message: 'invalid data',
            };
        }

        if (data.args !== null && (typeof data.args !== 'object' || Array.isArray(data.args))) {
            return {
                status: false,
                message: 'invalid args',
            };
        }

        const url = new URL(data.url, import.meta.url);
        const requestArgs = data.args === null ? [] : data.args;

        url.searchParams.set('method', data.method);
        url.searchParams.set('args', JSON.stringify(requestArgs));

        const response = await fetch(url);

        const responseText = await response.text();

        try {
            return JSON.parse(responseText);
        } catch (error) {
            return {
                status: false,
                message: 'invalid json response',
                response: responseText,
            };
        }
    }
    
    // pobranie aministratorow systemu 
    async getAdminSystem(){
        const data = {
            url: './php/admin_system.php',
            method: 'getAdminSystem',
            args: {
            }
        };
        return await this.fetchData(data);
    }






}
export default Data;