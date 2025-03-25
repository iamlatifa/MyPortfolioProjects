import axios from 'axios';

//const API_URL = 'http://localhost:8000';
const API_URL = 'https://e-attendance.webfs.dev/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const accessToken = localStorage.getItem('access_token');

//////////////////// Refresh Token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    console.log('Refresh token not available.');
    return false;
  }

  try {
    const response = await api.post('/token/refresh/', {refresh: refreshToken})

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

    return true;
  } catch (error) {
    console.log('Failed to refresh access token:', error.code);

    return false;
  }
}
api.interceptors.response.use(
  response => response,
  async error => {
    // Check if the error is a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Check if the error is caused by an expired access token
      if (error.response.data.code === 'token_not_valid' && error.response.data.detail === 'Given token not valid for any token type') {
        // Try to refresh the access token
        const accessTokenRefreshed = await refreshAccessToken();

        if (accessTokenRefreshed) {
          // If the access token was successfully refreshed, retry the original request
          console.log('token Refreshed')
          return  window.location.reload(); 
        } else {
          // If the access token could not be refreshed, redirect to the login page
          console.log('access token could not be refreshed');
          BlacklistToken()
        }
      } else {
        // If the error is not caused by an expired access token, reject the request
        return Promise.reject(error);
      }
    } else {
      // If the error is not a 401 Unauthorized error, reject the request
      return Promise.reject(error);
    }
  }
);
//////////////////// END Refresh Token




// LOGIN
export const getToken = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    return { access, refresh };
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error('Aucun compte actif trouvé avec les identifiants donnés');
    } else {
      throw new Error();
    }
  }
};
// END LOGIN

  // LOGOUT
export const BlacklistToken = async (accessToken, refreshToken) => {
    try {
      const { status } = await api.post(
        '/logout/',
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },//{withCredentials: true}
      );
  
      if (status === 205) {
        localStorage.clear();
        api.defaults.headers.common.Authorization = null;
        console.log('Blacklisted Token Success');
        window.location.href = '/login';
      }else{
        localStorage.clear();
        api.defaults.headers.common.Authorization = null;
        window.location.href = '/login';
        console.log('Cleared Storage Success');
      }
    } catch (error) {
      console.log('logout not working');
      localStorage.clear();
      api.defaults.headers.common.Authorization = null;
      window.location.href = '/login';
      console.log('Cleared Storage Success');
    }
};
  
// END LOGOUT






export const HomeView = async () => {
  const response = await api.get('/home/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}


export const GetStagiaires = async (year) => {
  const response = await api.get('/stagiaires/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: { year: year,
    },
  });
  console.log('year',year)
  return response.data;
};

export const GetFilieres = async (year) => {
    const response = await api.get('/filieres/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: { year: year,
      },
    });
    return response.data; 
};


export const GetGroupes = async (year) => {
    const response = await api.get('/groupes/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: { year: year,
      },
    });
    return response.data; 
};


export const GetSalles = async (year) => {
  const response = await api.get('/salles/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: { year: year,
    },
  });
  return response.data;  
};


export const GetFormateurs = async (year) => {
  const response = await api.get('/formateurs/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: { year: year,
    },
  });
  console.log(response.data)
  return response.data;
};




export const GetAbsences = async (year) => {
  const response = await api.get('/absences/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: { year: year,
    },
  });
  return response.data;
};

export const GetAbsenceById = async (id) => {
  const response = await api.get(`/absences/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const GeRetards = async (year) => {
  const response = await api.get('/retards/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: { year: year,
    },
  });
  return response.data;
};

export const GetRetardsId = async (id) => {
  const response = await api.get(`/absences/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}


export const GetAnnee = async () => {
  const response = await api.get('/annee/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}


export const GetGroupesByFiliereId = async (filiere_id) => {
  const response = await api.get(`/groupefiliere/${filiere_id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}


export const GetStagiairesByGroupeId = async (groupe_id) => {
  const response = await api.get(`/groupestagiaires/${groupe_id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}


export const SearchAttendance = async (query, year) => {
  const response = await api.get('/searchattendance/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: {
      query: encodeURIComponent(query),
      year: year,
    },
  });
  return response.data;
};




export const GetGroupeById = async (id) => {
  const response = await api.get(`/groupes/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const GetStagiaireById = async (id) => {
  console.log('ss')
  const response = await api.get(`/stagiaires/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const GetSalleById = async (id) => {
  const response = await api.get(`/salles/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const GetFormateurById = async (id) => {
  const response = await api.get(`/formateurs/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const GetFiliereById = async (id) => {
  const response = await api.get(`/filieres/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}





// DELETE REQUESTS formateur

export const DeleteFormateur = async (id) => {
  try {
    const response = await api.delete('/formateurs/' + id + '/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

// DELETE REQUESTS stagiaire

export const DeleteStagiaire = async (id) => {
  try {
    const response = await api.delete('/stagiaires/' + id + '/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

// DELETE REQUESTS filiere

export const DeleteFiliere = async (id) => {
  try {
    const response = await api.delete('/filieres/' + id + '/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

// DELETE REQUESTS

export const DeleteSalle = async (id) => {
  try {
    const response = await api.delete('/salles/' + id + '/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

// DELETE REQUESTS groupe

export const DeleteGroupe = async (id) => {
  try {
    const response = await api.delete('/groupes/' + id + '/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const PostStagiaires = async (salle, year) => {
  const response = await api.post('/stagiaires/', {
    type: salle.type.value,
    nom: salle.nom.value,
    annee_scolaire: year
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}


export const PostFilieres = async (filiere, year) => {
  const response = await api.post('/filieres/', {
    nom: filiere.nom.value,
    codefiliere: filiere.code.value,
    annee_scolaire: year
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PostGroupes = async (groupe, year) => {
  const response = await api.post('/groupes/', {
    filiere: groupe.filiere.value,
    nom: groupe.nom.value,
    annee_scolaire: year
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PostSalles = async (salle, year) => {
  const response = await api.post('/salles/', {
    type: salle.type.value,
    nom: salle.nom.value,
    annee_scolaire: year
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PostFormateurs = async (formateur, year) => {
  const response = await api.post('/formateurs/', {
    nom: formateur.nom.value,
    prenom: formateur.prenom.value,
    username: formateur.username.value,
    password: formateur.password.value,
    email: formateur.email.value,
    annee_scolaire: year
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PostAbsence = async (data) => {
  const response = await api.post('/absences/', {
    data
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PostRetard = async (data) => {
  const response = await api.post('/retards/', {
    data
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}


// PUT REQUESTS :

export const PutDeactivateStagiaire = async (id) => {
  const response = await api.put('/deactivateStagiaires/', { id }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutJustification = async (id, stagiaireId) => {
  const response = await api.put('/justifyAbsences/', {id, stagiaireId}, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutValidateAttendance = async (checkedRows) => {
    const response = await api.put('/validateAbsences/', { checkedRows }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
}

export const PutPermissionAttendance = async (checkedRows) => {
  const response = await api.put('/absencesPermission/', { checkedRows }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



export const PutAbsence = async (id,data) => {
  const response = await api.put(`/absences/${id}/`, {
    data
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutSalles = async (id, data) => {
  const response = await api.put(`/salles/${id}/`, {
    nom: data.nom,
    type: data.type,
    annee_scolaire: data.annee,

  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutFilieres = async (id, data) => {
  const response = await api.put(`/filieres/${id}/`, {
    nom: data.nom,
    codefiliere: data.code,
    annee_scolaire: data.annee,

  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutGroupes = async (id, data) => {
  
  const response = await api.put(`/groupes/${id}/`, {
    nom: data.nom,
    filiere: data.filiere,
    annee_scolaire: data.annee,

  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutStagiaires = async (id, data) => {
  const response = await api.put(`/stagiaires/${id}/`, {
      nom:data.nom,
      prenom:data.prenom,
      email:data.email,
      cin:data.cin,
      groupe:data.codegroupe,
      tel:data.tel,
    annee_scolaire: data.annee,

  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const PutFormateurs = async (id, data) => {
  const response = await api.put(`/formateurs/${id}/`, {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    // password:data.password,
    username:data.username,
    annee_scolaire: data.annee,

  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}



