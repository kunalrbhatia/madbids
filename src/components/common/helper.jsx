import { Component } from "react";

let a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
let b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
let getCommon_Data = {
  "currency_List":[],
  "country_List":[],
  "tax_List":[],
  "product_List":[],
  "supplier_List":[],
  "customer_List":[]
};

export class Helper extends Component {
  
  setCommonData = (node) =>{

  }

   getCommonData = node =>{
    let datanode = node+"_List";
    if(getCommon_Data[datanode].length>0){
      return "found"
    }else
      return "not found"
  }

  validateData(data, field) {
    switch (field) {
      case "username":
        if (data === "") {
          return false;
        } else {
          return true;
        }
      case "password":
        if (data === "") {
          return false;
        } else {
          return true;
        }
      default:
        break;
    }
  }

  showOverlay = () => {
    document.getElementsByTagName('body')[0].classList.add("fixbody");
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.classList.add("overlay");
    const spinner = document.createElement("div");
    spinner.classList.add("lds-ripple");
    const spinner_inner1 = document.createElement("div");
    const spinner_inner2 = document.createElement("div");
    spinner.appendChild(spinner_inner1);
    spinner.appendChild(spinner_inner2);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    document.getElementById("overlay").style.display = "block";
  };
  hideOverlay = () => {
    document.getElementsByTagName('body')[0].classList.remove("fixbody");
    const elem = document.getElementById("overlay");
    if(elem)
      document.body.removeChild(elem);
  };

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  hideOCR_box = () => {
    document.getElementById("invoice").style.display = "block";
    document.getElementById("OCRBox").style.display = "none";
  };
  showOCR_box = () => {
    document.getElementById("invoice").style.display = "none";
    document.getElementById("OCRBox").style.display = "block";
  };

 
  inWords = (num) => {
    let str = "";
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    str += (n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

  getQueryString = param => {
    let query = "";
    let esc = encodeURIComponent;
    query = Object.keys(param)
      .map(k => esc(k) + "=" + esc(param[k]))
      .join("&");

    return query;
  };

  getDays = (date1, date2) =>{
    let Difference_In_Time = date2.getTime() - date1.getTime(); 
    return(parseInt(Difference_In_Time / (1000 * 3600 * 24)));
  }

  addDays = (date, days) => {
    const newDate = new Date(Number(date))
    newDate.setDate(date.getDate() + days)
    return newDate
  }

  getProcessedImage = (url, data) => {
    const options = {
      method: "POST",
      body: data
    };
    return fetch(url, { method: options.method, body: options.body })
      .then(response => response.json())
      .then(responseData => {
        return responseData;
      })
      .catch(error => console.log(error));
  };

  getDropDownData(api, intialValue) {
    let DropDownData = [{ id: "", name: intialValue }];
    const options = {
      headers: { "Content-Type": "application/json" },
      method: "GET"
    };
    return this.getAPIdata(api, options)
      .then(response => {
        if (response && response.data) {
          let cData = response.data;
          cData.forEach(function(data) {
            DropDownData.push({ id: "" + data.id + "", name: data.name });
          });
        } else {
          console.log("error accourd");
        }
        return DropDownData;
      })
      .catch(error => {
        return DropDownData;
      });
    //return DropDownData;
  }

  getProcessed_ocrData(url, data) {
    const options = {
      method: "POST",
      body: data
    };
    return fetch(url, { method: options.method, body: options.body })
      .then(response => response.json())
      .then(responseData => {
        return responseData;
      })
      .catch(error => console.log(error));
  }

  getAPIdata(url, options) {
    return fetch(url, options)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        let errorResponse = {
          status: "error",
          msg: error.toString()
        };
        return errorResponse;
      });
  }

  static getAPIdata_MUI(url, options) {
    return fetch(url, options)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        let errorResponse = {
          status: "error",
          msg: error.toString()
        };
        return errorResponse;
      });
  }

  doLogout() {
    localStorage.setItem("token", "");
    localStorage.setItem("isLoggedIn", false);
  }

  getDateinFormat(newdate, format = "DD/MM/YYYY") {
    let nd = [];
    if (newdate.indexOf(".") > -1) {
      nd = newdate.split(".");
    } else if (newdate.indexOf("-") > -1) {
      nd = newdate.split("-");
    } else if (newdate.indexOf("/") > -1) {
      nd = newdate.split("/");
    } else if (newdate.indexOf(",") > -1) {
      nd = newdate.split(",");
    } else if (newdate.indexOf(" ") > -1) {
      nd = newdate.split(" ");
    }

    nd = nd[2] + "/" + nd[1] + "/" + nd[0];
    const formatedDate = new Date(nd);
    let fDate = "";
    let dd = formatedDate.getDate();
    let mm = formatedDate.getMonth() + 1;
    const yyyy = formatedDate.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    switch (format) {
      case "DD/MM/YYYY":
        fDate = dd + "/" + mm + "/" + yyyy;
        break;
      case "MM/DD/YYYY":
        fDate = mm + "/" + dd + "/" + yyyy;
        break;
      case "DD-MM-YYYY":
        fDate = dd + "-" + mm + "-" + yyyy;
        break;
      case "MM-DD-YYYY":
        fDate = mm + "-" + dd + "-" + yyyy;
        break;
      case "YYYY-MM-DD":
        fDate = yyyy + "-" + mm + "-" + dd;
        break;
      case "YYYY-DD-DD":
        fDate = yyyy + "-" + dd + "-" + mm;
        break;
      default:
        fDate = dd + "/" + mm + "/" + yyyy;
        break;
    }
    return fDate;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  roundNum(value, decimal = 2) {
    if (!isNaN(value) && value) {
      let num = parseFloat(value).toFixed(decimal);
      num = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      return parseFloat(num);
    } else {
      return 0;
    }
  }
  
  trimValue(value) {
    return value
      .toString()
      .replace("Rs.", "")
      .replace(",", "")
      .replace(" ", "")
      .replace("NOS", "")
      .replace("NOs.", "")
      .replace("%", "")
      .replace("GST", "")
      .replace("Kg", "")
      .replace("kg", "")
      .replace("Kgs", "");
  }

  setFormLableOnTop() {
    let elem = document.getElementsByClassName("formfieldBox");
    for (let i = 0; i < elem.length; i++) {
      const input_elem = elem[i].querySelectorAll("input");
      const input_label = elem[i].querySelectorAll(".label");
      if (input_elem.length > 0) {
        if (input_elem[0].value === "") {
          if (input_label.length > 0) input_label[0].classList.remove("up");
        } else if (input_elem[0].value !== "") {
          if (input_label.length > 0) input_label[0].classList.add("up");
        }
      }
    }
  }
}

export default { Helper };