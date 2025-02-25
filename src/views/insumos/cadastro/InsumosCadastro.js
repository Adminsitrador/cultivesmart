import React, { useState, useRef, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CImage,
  CCardImage,
  CForm,
  CFormTextarea,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CConditionalPortal,
} from '@coreui/react';
import { Stepper, Step } from 'react-form-stepper';
import avatar8 from './../../../assets/images/microverdes/product_default.png'
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [unidadesMedida , setUnidadesMedida ] = useState([]);   
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [additionalFields, setAdditionalFields] = useState({ // Estado para os campos adicionais
    quantidade_inicial: '',
    unidade_medida_conteudo: '',
    quantidade_consumida: '',
  });
  const hiddenFileInput = useRef(null);
  const stepLabels = [
    { title: "Categoria", subtitle: "Escolha a categoria" },
    { title: "Fornecedor", subtitle: "Defina o fornecedor" },
    { title: "Informações", subtitle: "Preencha as informações principais" },
    { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
  ];

  const [formData, setFormData] = useState({
    nome:'',
    categoria_id: '',
    fornecedor_id: '',
    variedade: '',
    descricao: '',
    unidade_medida: '',
    logo: null
  });

  const categoryNames = {
    '1': 'Sementes - Microverde',
    '2': 'Flores Comestíveis',
    '3': 'Substrato',
  };

  const handleSubstratoSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSubstratos(selectedOptions);
  };

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/categorias')
      .then(response => response.json())
      .then(data => {
        setCategorias(data);
      })
      .catch(error => console.error('Erro ao buscar categorias:', error));
 
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then(response => response.json())
      .then(data => {
        setFornecedores(data);
      })
      .catch(error => console.error('Erro ao buscar fornecedores:', error));

    fetch('https://backend.cultivesmart.com.br/api/unidades-medida')
      .then(response => response.json())
      .then(data => {
        setUnidadesMedida(data);
      })
      .catch(error => console.error('Erro ao buscar unidades de medida:', error));
  }, []);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFormData((prevData) => ({
          ...prevData,
          logo: file,
          logoUrl: URL.createObjectURL(file),
      }));
    }

  };

  const handleImageClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [id]: type === 'checkbox' ? checked : value,
    }));

    if (event.target.name === 'define_especificacao') { // Assuming this is the id of your radio button group
      setShowSpecificationFields(value === '1'); // Show if value is '1' (Sim)
    }

    // Clear error for the current field when it's changed
    setStepErrors(prevErrors => {
        const newErrors = [...prevErrors];
        // Find the step the field belongs to and clear the error
        if (activeStep === 1 && id === 'fornecedor_id') newErrors[activeStep] = false;
        if (activeStep === 2 && ['descricao', 'unidade_medida', 'estoque_minimo'].includes(id)) newErrors[activeStep] = false;
        if (activeStep === 3 && ['dias_pilha', 'dias_blackout', 'dias_colheita', 'hidratacao'].includes(id)) newErrors[activeStep] = false;
        return newErrors;
    });
};

const handleChange1 = (event) => {
  const { value } = event.target;
  setShowSpecificationFields(value === '1'); // Atualiza o estado com base no valor do rádio
};

  const handleNext = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newStepErrors = [...stepErrors];

    // Validation logic for each step
    if (activeStep === 0 && !selectedCategory) {
        hasErrors = true;
    } else if (activeStep === 1 && !formData.fornecedor_id) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      selectedCategory === "1" && (
          !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
          !formData.unidade_medida)
   ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      selectedCategory === 2 && (!formData.nome.trim() ||  !formData.variedade.trim() || !formData.descricao.trim())
    ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }
    setStepErrors(newStepErrors);

    if (!hasErrors) {
        setActiveStep(prevStep => prevStep + 1);
    }
};

const handleAdditionalFieldsChange = (event) => {
  const { id, value } = event.target;
  setAdditionalFields(prevState => ({
    ...prevState,
    [id]: value,
  }));
};

const handleOpenAdditionalFieldsModal = () => {
  setShowAdditionalFieldsModal(true);
};

const handleCloseAdditionalFieldsModal = () => {
  setShowAdditionalFieldsModal(false);
};

const handleSaveAdditionalFields = () => {
  // Atualiza o formData com os valores do modal
  setFormData(prevState => ({
    ...prevState,
    quantidade_inicial: additionalFields.quantidade_inicial,
    unidade_medida_conteudo: additionalFields.unidade_medida_conteudo,
    quantidade_consumida: additionalFields.quantidade_consumida,
  }));
  setShowAdditionalFieldsModal(false); // Fecha o modal
};

const handleCategorySelect = (categoria_id) => {
  setSelectedCategory(categoria_id);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    categoria_id: categoria_id  // Atualiza o valor da categoria no formData
  }));
};

const handleFornecedorSelect = (id) => {
  setFormData(prevState => ({
      ...prevState,
      fornecedor_id: id
  }));
  setSelectedFornecedor(id);
};

const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  // Clear errors for the current step when going back
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; // Clear errors for the current step
      return newErrors;
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData(); // Use FormData para enviar arquivos
        
      for (const key in formData) {
        formDataToSend.append(key, formData[key]); // Append all data to FormData
      }
      
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Insumo cadastrado com sucesso!');
        setFormData({
          selectedCategory: 0,
          categoria_id: '', fornecedor_id: '', descricao: '', unidade_medida: '',
          estoque_minimo: 0, dias_pilha: 0, dias_blackout: 0, dias_colheita: 0, hidratacao: '',
          colocar_peso: true, substrato: false
        });
        setActiveStep(0);
      } else {
        alert('Erro ao cadastrar insumo!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <CContainer>
      <Stepper activeStep={activeStep}>
        <Step label="Categoria" onClick={() => setActiveStep(0)} />
        <Step label="Fornecedor" onClick={() => setActiveStep(1)} />
        <Step label="Informações" onClick={() => setActiveStep(2)} />
        <Step label="Resumo" onClick={() => setActiveStep(3)} />
      </Stepper>
      <CForm onSubmit={handleSubmit} className="row g-3">
          
          {activeStep === 0 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >

                    {categorias && categorias.records && categorias.records.map((categoria) => {
                          return (
                            <CCol lg={4} key={categoria.id}>
                              <CCard color={ selectedCategory === categoria.id ? 'success' : 'light'}
                                      textColor={ selectedCategory === categoria.id ? 'white' : ''}
                                      className="h-100"
                                      onClick={() => handleCategorySelect(categoria.id)}
                                      style={{cursor: 'pointer'}}>
                                <CCardImage orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
                                <CCardBody>
                                  <CCardTitle>{categoria.descricao}</CCardTitle>
                                  <CCardText>
                                      <small>{categoria.comentarios}</small>
                                  </CCardText>
                                </CCardBody>
                              </CCard>
                            </CCol>
                          );
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}

          {activeStep === 1 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow>
                        {fornecedores.records.map((fornecedor) => {
                          return (
                          <CCol lg={4} key={fornecedor.id}>
                            <CCard key={fornecedor.id}
                              color={ selectedFornecedor === fornecedor.id ? 'success' : 'light'}
                              textColor={ selectedFornecedor === fornecedor.id ? 'white' : ''}
                              className="mb-3"
                              onClick={() => handleFornecedorSelect (fornecedor.id)}
                              style={{cursor: 'pointer'}}>
                              <CCardHeader>{fornecedor.nome}</CCardHeader>
                              <CCardImage
                                src={`data:image/png;base64,${fornecedor.logoPath}`}
                                style={{cursor: 'pointer', maxHeight: '20em', width: '100%', height: '100%', objectFit: 'cover'}}
                                onError={(e) => console.error('Erro ao carregar imagem:', e.target.src, e)}

                              />
                            </CCard>
                          </CCol>);
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}
            
          {activeStep === 2 && (
              <CRow>
                <CCol xs={12} md={12}>
                  <CCard className="mb-4" style={{cursor: 'pointer'}}>
                    <CCardHeader>
                      <strong>{stepLabels[2].title} - </strong>
                      <small>{stepLabels[2].subtitle}</small>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={3}>
                          <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer', maxHeight: '17em', width: '100%', objectFit: 'cover',
                              height: '100%' }} />
                            <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleLogoChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                          />
                        </CCol>
                        <CCol md={9}>
                        <CRow>
                          <CCol md={5}>
                            <CFormInput
                                  type="text"
                                  id="nome"
                                  floatingClassName="mb-3"
                                  floatingLabel="Nome"
                                  value={formData.nome}
                                  onChange={handleChange} required
                                  className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''}
                                />
                          </CCol>
                          
                          <CCol md={4}>
                            <CFormInput
                                    type="text"
                                    id="variedade"
                                    floatingClassName="mb-3"
                                    floatingLabel="Variedade"
                                    value={formData.variedade}
                                    onChange={handleChange}
                                    required
                                    className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                                  />
                          </CCol>
                          
                          <CCol md={3}>
                          
                            <CFormSelect
                                  id="unidade_medida"
                                  floatingLabel="Unidade de Medida"
                                  aria-label="Floating label select example"
                                  value={formData.unidade_medida}
                                  onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value === "3") { // Se for saco (unidade 1), abre o modal
                                      handleOpenAdditionalFieldsModal();
                                    }
                                  }}
                                  className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
                                  required
                                >
                                  <option value="" disabled>Escolha...</option>
                                  {
                                    unidadesMedida && unidadesMedida.map((unidadeMedida) => {
                                      return (
                                        <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
                                      )
                                  }
                                )}
                              </CFormSelect>
                              {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                          </CCol>
                          
                          <CCol md={12}  xs={{ gutterY: 5}}>
                            <CFormTextarea
                              id="descricao"
                              value={formData.descricao}
                              floatingLabel="Descricao" 
                              floatingClassName="mb-3"                         
                              onChange={handleChange}
                              style={{ minHeight: '200px' }} // Altura mínima
                              className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                              required
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                      </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              // ||
              // selectedCategory === '2' && (
              //   <CRow>
              //     <CCol xs={12} md={12}>
              //       <CCard className="mb-4" style={{cursor: 'pointer'}}>
              //         <CCardHeader>
              //           <strong>{stepLabels[2].title} - </strong>
              //           <small>{stepLabels[2].subtitle}</small>
              //         </CCardHeader>
              //         <CCardBody>
              //           <CRow>
              //             <CCol md={3}>
              //               <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
              //                 onClick={handleImageClick}
              //                 style={{ cursor: 'pointer', maxHeight: '17em', width: '100%', objectFit: 'cover',
              //                   height: '100%' }} />
              //                 <input
              //                 type="file"
              //                 ref={hiddenFileInput}
              //                 onChange={handleLogoChange}
              //                 style={{ display: 'none' }}
              //                 accept="image/*"
              //               />
              //             </CCol>
              //             <CCol md={9}>
              //             <CRow>
              //               <CCol md={5}>
              //                 <CFormInput
              //                       type="text"
              //                       id="nome"
              //                       floatingClassName="mb-3"
              //                       floatingLabel="Nome"
              //                       value={formData.nome}
              //                       onChange={handleChange} required
              //                       className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''}
              //                     />
              //               </CCol>
                            
              //               <CCol md={4}>
              //                 <CFormInput
              //                         type="text"
              //                         id="variedade"
              //                         floatingClassName="mb-3"
              //                         floatingLabel="Variedade"
              //                         value={formData.variedade}
              //                         onChange={handleChange}
              //                         required
              //                         className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
              //                       />
              //               </CCol>
                            
              //               <CCol md={3}>
              //                 <CFormSelect
              //                       id="unidade_medida"
              //                       floatingLabel="Unidade de Medida"
              //                       aria-label="Floating label select example"
              //                       value={formData.unidade_medida}
              //                       onChange={(e) => {
              //                         handleChange(e);
              //                         if (e.target.value === '1') { // Se for saco (unidade 1), abre o modal
              //                           handleOpenAdditionalFieldsModal();
              //                         }
              //                       }}
              //                       className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
              //                       required
              //                     >
              //                     <option value="" disabled>Escolha...</option>
              //                     <option value="1">Sacos</option>
              //                     <option value="2">Gramas</option>
              //                     <option value="3">Unidades</option>
              //                     <option value="4">Litro</option>
              //                   </CFormSelect>
              //                   {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
              //               </CCol>
                            
              //               <CCol md={12}  xs={{ gutterY: 5}}>
              //                 <CFormTextarea
              //                   id="descricao"
              //                   value={formData.descricao}
              //                   floatingLabel="Descricao" 
              //                   floatingClassName="mb-3"                         
              //                   onChange={handleChange}
              //                   style={{ minHeight: '200px' }} // Altura mínima
              //                   className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
              //                   required
              //                 ></CFormTextarea>
              //               </CCol>
              //             </CRow>
              //           </CCol>
              //           </CRow>
              //         </CCardBody>
              //       </CCard>
              //     </CCol>
              //   </CRow>
              // )
              // ||
              // selectedCategory === '3' && (
              //   <CRow>
              //   <CCol xs={12} md={12}>
              //     <CCard className="mb-4" style={{cursor: 'pointer'}}>
              //       <CCardHeader>
              //         <strong>{stepLabels[2].title} - </strong>
              //         <small>{stepLabels[2].subtitle}</small>
              //       </CCardHeader>
              //       <CCardBody>
              //         <CRow>
              //           <CCol md={3}>
              //             <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
              //               onClick={handleImageClick}
              //               style={{ cursor: 'pointer', maxHeight: '17em', width: '100%', objectFit: 'cover',
              //                 height: '100%' }} />
              //               <input
              //               type="file"
              //               ref={hiddenFileInput}
              //               onChange={handleLogoChange}
              //               style={{ display: 'none' }}
              //               accept="image/*"
              //             />
              //           </CCol>
              //           <CCol md={9}>
              //           <CRow>
              //             <CCol md={5}>
              //               <CFormInput
              //                     type="text"
              //                     id="nome"
              //                     floatingClassName="mb-3"
              //                     floatingLabel="Nome"
              //                     value={formData.nome}
              //                     onChange={handleChange} required
              //                     className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''}
              //                   />
              //             </CCol>
                          
              //             <CCol md={4}>
              //               <CFormInput
              //                       type="text"
              //                       id="variedade"
              //                       floatingClassName="mb-3"
              //                       floatingLabel="Variedade"
              //                       value={formData.variedade}
              //                       onChange={handleChange}
              //                       required
              //                       className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
              //                     />
              //             </CCol>
                          
              //             <CCol md={3}>
              //               <CFormSelect
              //                     id="unidade_medida"
              //                     floatingLabel="Unidade de Medida"
              //                     aria-label="Floating label select example"
              //                     value={formData.unidade_medida}
              //                     onChange={(e) => {
              //                       handleChange(e);
              //                       if (e.target.value === '1') { // Se for saco (unidade 1), abre o modal
              //                         handleOpenAdditionalFieldsModal();
              //                       }
              //                     }}
              //                     className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
              //                     required
              //                   >
              //                   <option value="" disabled>Escolha...</option>
              //                   <option value="1">Sacos</option>
              //                   <option value="2">Gramas</option>
              //                   <option value="3">Unidades</option>
              //                   <option value="4">Litro</option>
              //                 </CFormSelect>
              //                 {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
              //             </CCol>
                          
              //             <CCol md={12}  xs={{ gutterY: 5}}>
              //               <CFormTextarea
              //                 id="descricao"
              //                 value={formData.descricao}
              //                 floatingLabel="Descricao" 
              //                 floatingClassName="mb-3"                         
              //                 onChange={handleChange}
              //                 style={{ minHeight: '200px' }} // Altura mínima
              //                 className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
              //                 required
              //               ></CFormTextarea>
              //             </CCol>
              //           </CRow>
              //         </CCol>
              //         </CRow>
              //       </CCardBody>
              //     </CCard>
              //   </CCol>
              //   </CRow>
              // )
          )}

          {activeStep === 3 && (
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <strong>{stepLabels[activeStep].title} - </strong>
                    <small>{stepLabels[activeStep].subtitle}</small>
                  </CCardHeader>
                  <CCardBody>
                    <div>
                      <h2 className="text-xl font-bold">Resumo</h2>
                      <p><strong>Categoria:</strong> {categoryNames[formData.categoria_id]}</p>
                      <p><strong>Fornecedor:</strong> {fornecedores.records[0].nome}</p>
                      <p><strong>Nome:</strong> {formData.nome}</p>
                      <p><strong>Variedade:</strong> {formData.variedade}</p>
                      <p><strong>Descrição:</strong> {formData.descricao}</p>
                      <p><strong>Unidade de Medida:</strong> {unidadesMedida.find(unidade => unidade.id === Number(formData.unidade_medida)).descricao}</p>
                      <p><strong>Quantidade:</strong> {formData.quantidade_inicial} {unidadesMedida.find(unidade => unidade.id === Number(formData.unidade_medida_conteudo)).sigla}</p>

                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
          )}
          
          <CRow className="mt-4">
            {activeStep > 0 && (
              <CCol>
                <CButton color="secondary" onClick={handleBack}>Voltar</CButton>
              </CCol>
            )}
            {activeStep === 3 ? (
              <CCol>
              <CButton color="success" type="submit">Cadastrar</CButton>
            </CCol>
            ) : (
              <CCol>
                <CButton color="primary" onClick={(e) => handleNext(e)}>Próximo</CButton>
              </CCol>
            )}
          </CRow>
        
      </CForm>
      {/* Modal para campos adicionais */}
      <CModal alignment="center" visible={showAdditionalFieldsModal} onClose={handleCloseAdditionalFieldsModal}>
        <CModalHeader closeButton>
          <strong>Informações de medida do Insumo</strong>
        </CModalHeader>
        <CModalBody>
          <CRow lg={4}>
          <CFormInput
            type="number"
            id="quantidade_inicial"
            floatingClassName="mb-3"
            floatingLabel="Quantidade"
            value={additionalFields.quantidade_inicial}
            onChange={handleAdditionalFieldsChange}
          />
          <CFormSelect
            id="unidade_medida_conteudo"
            floatingLabel="Unidade de Medida"
            value={additionalFields.unidade_medida_conteudo}
            onChange={handleAdditionalFieldsChange}
          >
            {
              unidadesMedida.map((unidadeMedida) => { return (
                <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
              )
              })
            }
            <option value="kg">Kilogramas</option>
          </CFormSelect>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseAdditionalFieldsModal}>
            Fechar
          </CButton>
          <CButton color="primary" onClick={handleSaveAdditionalFields}>
            Salvar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>

    
  );
};

export default InsumosCadastro;