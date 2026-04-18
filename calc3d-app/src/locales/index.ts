export const translations = {
  es: {
    nav: {
      login: 'Iniciar sesión',
      register: 'Únete gratis',
      diario: 'Diario',
      calculadora: 'Calculadora',
      presupuesto: 'Presupuesto',
      bobinas: 'Bobinas',
      impresoras: 'Impresoras',
      estadisticas: 'Estadísticas',
      consumibles: 'Consumibles',
      ajustes: 'Ajustes',
      feedback: 'Sugerencias',
      admin: 'Panel Admin',
      logout: 'Cerrar sesión'
    },
    landing: {
      badge: 'Lo que el filamento no te da',
      title: 'Tu herramienta profesional para la <span class="text-gradient">impresión 3D</span>',
      desc: 'Gestiona tus impresoras, calcula costes exactos, controla tu inventario y genera presupuestos profesionales en segundos. Todo en una plataforma moderna y gratuita para la comunidad maker.',
      cta: 'Empezar ahora — Es gratis',
      stats: {
        printers: 'Impresoras',
        filaments: 'Filamentos',
        monthly_cost: 'Coste Mensual',
        saved_calcs: 'Cálculos'
      },
      features: {
        subtitle: 'Potencia tu taller',
        title: 'Herramientas avanzadas, <span class="text-gradient">todo gratis</span>',
        calc: { title: 'Calculadora de Costes', desc: 'Precisión total incluyendo luz, desgaste y material.' },
        budget: { title: 'Presupuestos PDF', desc: 'Genera PDFs profesionales para tus clientes al instante.' },
        inventory: { title: 'Gestión de Stock', desc: 'Controla tus bobinas y recibe avisos de bajo nivel.' },
        public_db: { title: 'Base de Datos Pública', desc: 'Accede a perfiles de impresoras y filamentos compartidos.' },
        stats: { title: 'Estadísticas de Uso', desc: 'Visualiza tu consumo y ahorro a lo largo del tiempo.' },
        mobile: { title: 'Diseño Pro-Mobile', desc: 'Gestiona tu granja de impresión desde cualquier lugar.' }
      },
      how_it_works: {
        subtitle: 'Simplicidad máxima',
        start: 'Cómo <span class="text-gradient">empezar</span>',
        step1: { title: 'Crea tu Cuenta', desc: 'Regístrate en menos de 10 segundos.' },
        step2: { title: 'Añade tu Setup', desc: 'Configura tus impresoras y tus bobinas de filamento.' },
        step3: { title: 'Calcula y Exporta', desc: 'Obtén costes exactos y genera presupuestos profesionales.' }
      },
      community: {
        subtitle: 'Comunidad Maker',
        title: 'Foro de Soporte <br /><span class="text-gradient">y Actualizaciones</span>',
        desc: 'Conéctate con otros makers, comparte configuraciones y mantente al día con las novedades.',
        loading: 'Cargando muro de la comunidad...',
        empty: 'Aún no hay mensajes en el muro.',
        official: 'Oficial',
        community_tag: 'Comunidad'
      },
      cta_final: {
        subtitle: '¿Listo para el siguiente nivel?',
        title: 'La mejor forma de <span class="text-gradient">empezar a calcular</span>',
        desc: 'Únete a cientos de usuarios que ya optimizan su flujo de trabajo cada día.',
        btn: 'Crear mi cuenta gratuita'
      },
      footer: 'MyCalc3D — Creado con ❤️ por la comunidad.'
    },
    settings: {
      title: 'Ajustes',
      subtitle: 'Configura tu perfil y valores por defecto',
      profile: 'Perfil',
      email: 'Email de la cuenta',
      password: {
        title: 'Cambiar Contraseña',
        desc: 'Actualiza tu contraseña de acceso a MyCalc3D.',
        new: 'Nueva Contraseña',
        min: 'Mínimo 6 caracteres',
        update: 'Actualizar Contraseña',
        updating: 'Actualizando...',
        success: 'Contraseña actualizada correctamente'
      },
      defaults: {
        title: 'Valores por defecto',
        desc: 'Estos valores se usarán automáticamente en la calculadora si no seleccionas una impresora o filamento específico.',
        elec: 'Precio Electricidad (€/kWh)',
        weight: 'Peso estándar bobinas (g)',
        saved: 'Ajustes guardados',
        saving: 'Guardando...',
        save: 'Guardar ajustes'
      },
      language: {
        title: 'Idioma de la aplicación',
        desc: 'Selecciona el idioma de la interfaz.'
      }
    },
    auth: {
      login_title: 'Bienvenido de nuevo',
      login_subtitle: 'Inicia sesión en tu cuenta',
      email: 'Email',
      password: 'Contraseña',
      forgot: '¿Olvidaste tu contraseña?',
      login_btn: 'Iniciar sesión →',
      logging_in: 'Iniciando sesión...',
      no_account: '¿No tienes cuenta?',
      register_link: 'Regístrate gratis',
      back_home: '← Volver al inicio',
      error_login: 'Email o contraseña incorrectos',
      register_title: 'Crea tu cuenta',
      register_subtitle: 'Gratis para siempre · Sin límites',
      name: 'Nombre',
      pass_min: 'Mín. 6 caracteres',
      register_btn: 'Crear cuenta gratis →',
      creating: 'Creando cuenta...',
      have_account: '¿Ya tienes cuenta?',
      login_link: 'Iniciar sesión',
      register_success: {
        title: '¡Casi listo!',
        verify_email: '⚠️ ¡Por favor, revisa tu correo electrónico!',
        verify_desc: 'Te hemos enviado un enlace de confirmación. **Debes verificar tu cuenta primero** antes de poder iniciar sesión (revisa la carpeta de Spam/Correo no deseado por si acaso).',
        go_login: 'Ir a iniciar sesión →'
      },
      forgot_password: {
        title: 'Recuperar contraseña',
        desc: 'Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.',
        submit_btn: 'Enviar enlace de recuperación',
        sending: 'Enviando...',
        success: 'Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.',
        back_login: 'Volver a iniciar sesión'
      },
      update_password: {
        title: 'Sustituir contraseña',
        desc: 'Introduce tu nueva contraseña a continuación.',
        label: 'Nueva contraseña',
        submit_btn: 'Actualizar contraseña',
        updating: 'Actualizando...',
        success: '¡Contraseña actualizada! Redirigiendo...'
      }
    },
    common: {
      loading: 'Cargando...',
      saving: 'Guardando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Añadir',
      open: 'Abrir',
      success: 'Éxito',
      error: 'Error',
      actions: 'Acciones',
      search: 'Buscar...',
      select: 'Seleccionar...',
      optional: '(opcional)',
      back: 'Volver',
      none: 'Ninguno',
      verified: 'Verificada',
      unverified: 'No verificada',
      confirm_delete: '¿Estás seguro de que quieres eliminar este elemento?',
      manual_selection: 'Selección manual',
      saved: '¡Guardado!',
      units: {
        g: 'g',
        kg: 'kg',
        ml: 'ml',
        l: 'L',
        ud: 'ud',
        ud_full: 'Unidades (ud)'
      }
    },
    printers: {
      title: 'Impresoras',
      subtitle: 'Tus equipos de impresión',
      add_btn: '+ Añadir impresora',
      empty: {
        title: 'Sin impresoras añadidas',
        desc: 'Añade tus impresoras desde nuestra base de datos para tenerlas disponibles al calcular.',
        btn: '+ Añadir tu primera impresora'
      },
      card: {
        custom: 'Impresora personalizada',
        consumption: 'Consumo (W)',
        edit_consumption: 'Clic para editar consumo',
        default_val: 'Valor por defecto:',
        manual_tag: 'personalizado'
      },
      modal: {
        title: 'Añadir impresora',
        tab_db: 'Base de Datos',
        tab_manual: 'Manual',
        search_label: 'Buscar en la base de datos',
        search_placeholder: 'Bambu, Prusa, Creality, Artillery...',
        select_label: 'Seleccionar impresora',
        nickname_label: 'Apodo (opcional)',
        nickname_placeholder: 'Mi Bambu, Impresora del taller...',
        manual_name: 'Nombre de tu impresora',
        manual_name_placeholder: 'Ej: Artillery Genius Pro',
        duplicates_warn: 'Posibles coincidencias en la BD. ¿No es una de estas?',
        wattage_label: 'Consumo (W)',
        wattage_placeholder: '300',
        wattage_hint: 'Típico: 150W–500W',
        type_label: 'Tipo',
        contribute_label: 'Añadir a la base de datos pública',
        contribute_desc: 'Se añadirá como "no verificada" hasta revisión',
        save_error: 'Error al guardar en tus impresoras:',
        contrib_error: 'Error al contribuir a la base de datos:',
        notes_label: 'Notas'
      }
    },
    spools: {
      title: 'Bobinas',
      subtitle: 'Inventario de filamentos',
      add_btn: '+ Añadir bobina',
      empty: {
        title: 'Sin bobinas',
        desc: 'Añade tus bobinas de filamento para hacer seguimiento del material restante.',
        btn: '+ Añadir primera bobina'
      },
      card: {
        remaining: 'restantes',
      },
      modal: {
        title_new: 'Nueva bobina',
        title_edit: 'Editar bobina',
        tab_catalog: 'Catálogo',
        tab_manual: 'Manual',
        search_label: 'Buscar filamento',
        search_placeholder: 'eSUN PLA+, Bambu Black...',
        select_label: 'Seleccionar del catálogo',
        brand_label: 'Marca',
        brand_placeholder: 'eSUN, Bambu...',
        material_label: 'Material',
        duplicates_title: 'Ya existe en el catálogo:',
        color_label: 'Color',
        color_placeholder: 'Blanco, Negro...',
        color_hex_label: 'Color (hex)',
        weight_total: 'Peso total (g)',
        weight_remaining: 'Restante (g)',
        price_label: 'Precio de compra (€)',
        price_placeholder: 'Opcional',
        contribute_label: 'Contribuir al catálogo público',
        contribute_desc: 'Otros podrán elegir esta marca/material directamente',
        error_save: 'Error al guardar cambios:',
        error_add: 'Error al añadir bobina:',
        error_contrib: 'Error al contribuir al catálogo:'
      }
    },
    chronicle: {
      title: 'Diario',
      subtitle: 'Historial de tus impresiones',
      add_btn: '+ Nueva entrada',
      loading: 'Cargando...',
      empty: {
        title: 'Sin impresiones aún',
        desc: 'Registra tu primera impresión para empezar a llevar el historial.',
        btn: '+ Añadir impresión'
      },
      card: {
        weight: 'Peso:',
        time: 'Tiempo:',
        cost: 'Coste:',
        rating: 'Puntuación:'
      },
      status: {
        completed: 'Completada',
        failed: 'Fallida',
        in_progress: 'En curso'
      },
      modal: {
        title: 'Nueva entrada en el diario',
        name_label: 'Nombre',
        name_placeholder: 'Ej: Soporte monitor',
        desc_label: 'Descripción (opcional)',
        desc_placeholder: 'Notas sobre esta impresión...',
        weight_label: 'Peso (g)',
        time_label: 'Tiempo (h)',
        cost_label: 'Coste total (€)',
        status_label: 'Estado',
        rating_label: 'Valoración',
        ratings: {
          5: '5 - Excelente',
          4: '4 - Muy bien',
          3: '3 - Bien',
          2: '2 - Regular',
          1: '1 - Mal'
        }
      }
    },
    calculator: {
      title: 'Calculadora',
      subtitle: 'Calcula el coste exacto de tu impresión',
      form: {
        custom_printer: 'Impresora personalizada',
        hours: 'Horas',
        minutes: 'Minutos',
        minutes_short: 'min',
        wattage_label: 'Consumo (W)',
        amortization_label: 'Amortización (€/h)',
        margin_label: 'Margen'
      },
      sections: {
        printer: 'Impresora',
        filament: 'Filamento',
        time_elec: 'Tiempo & Electricidad'
      },
      fields: {
        select_printer: 'Seleccionar impresora',
        manual: 'Manual',
        wattage: 'Consumo (W)',
        material: 'Material',
        all: 'Todos',
        filament: 'Filamento',
        weight: 'Peso usado (g)',
        price_kg: 'Precio por kg (€)',
        hours: 'Horas',
        minutes: 'Minutos',
        kwh_price: 'Precio kWh (€)',
        amortization: 'Amortización (€/h)'
      },
      btn_calc: 'Calcular coste →',
      results: {
        empty: 'Rellena los datos y pulsa calcular para ver el desglose de costes',
        total_cost: 'Coste total',
        breakdown: {
          material: 'Material',
          elec: 'Electricidad',
          amort: 'Amortización',
          total: 'TOTAL'
        },
        save_success: '¡Cálculo guardado en tu historial!',
        save_btn: 'Guardar cálculo',
        saving: 'Guardando...',
        quote_hint: 'Para presupuestos con mano de obra y margen, usa'
      }
    },
    stats: {
      title: 'Estadísticas',
      subtitle: 'Resumen de tu actividad de impresión',
      empty: {
        title: 'Sin datos aún',
        desc: 'Usa la calculadora para guardar cálculos y ver aquí tus estadísticas.'
      },
      labels: {
        total_spend: 'Gasto total',
        saved_calcs: 'Cálculos guardados',
        total_material: 'Material total',
        total_time: 'Tiempo total',
        avg_cost: 'Coste medio'
      },
      charts: {
        monthly_spend: 'Gasto mensual'
      },
      saved_table: {
        title: 'Cálculos guardados',
        date: 'Fecha',
        name: 'Nombre',
        material: 'Material',
        actions: 'Acciones'
      },
      delete_confirm: '¿Seguro que quieres borrar este elemento?'
    },
    consumables: {
      title: 'Consumibles',
      subtitle: 'Gestión de piezas y materiales',
      add_btn: 'Añadir consumible',
      empty: {
        title: 'Inventario vacío',
        desc: 'Añade tus consumibles (boquillas, lacas, resinas...) para llevar el control del stock.'
      },
      categories: {
        glue: 'Adhesivos/Lacas',
        resin: 'Resinas',
        parts: 'Repuestos',
        tools: 'Herramientas',
        other: 'Otros'
      },
      labels: {
        stock: 'Stock',
        unit_price: 'Precio unitario'
      },
      modal: {
        add_title: 'Añadir consumible',
        edit_title: 'Editar consumible',
        name_label: 'Nombre',
        name_placeholder: 'Ej: Boquilla latón 0.4, Laca 3DLac...',
        category_label: 'Categoría',
        unit_label: 'Unidad de medida',
        stock_label: 'Stock actual',
        price_label: 'Precio (€)'
      }
    },
    feedback: {
      title: 'Sugerencias y Fallos',
      subtitle: 'Ayúdanos a mejorar MyCalc3D reportando errores o proponiendo ideas.',
      error_sending: 'Error al enviar la sugerencia: ',
      success: {
        title: '¡Gracias por tu mensaje!',
        desc: 'Hemos recibido tu sugerencia. El equipo de administración la revisará pronto.',
        send_another: 'Enviar otro mensaje'
      },
      form: {
        type_label: '¿Qué quieres enviarnos?',
        suggestion: 'Sugerencia',
        bug: 'Reportar Fallo',
        subject_label: 'Asunto',
        subject_placeholder: 'Ej: Nueva funcionalidad, Error en la calculadora...',
        message_label: 'Mensaje detallado',
        message_placeholder: 'Describe tu idea o el problema que has encontrado con el mayor detalle posible...',
        submit_btn: 'Enviar mensaje al administrador'
      },
      info: {
        title: '¿Por qué es importante?',
        desc: 'Calc3D es un proyecto en constante evolución. Tu feedback directo llega a nuestro Panel de Administración, donde revisamos cada propuesta para implementar las mejoras que la comunidad de impresión 3D necesita.'
      }
    },
    quote: {
      title: 'Presupuesto Rápido',
      subtitle: 'Genera un presupuesto profesional para tus clientes',
      default_calc_name: 'Presupuesto',
      calculate_btn: 'Calcular Presupuesto',
      calculating_msg: 'Calculando...',
      sections: {
        client_title: 'Información del Cliente',
        client_name: 'Nombre del Cliente',
        client_placeholder: 'Ej: Juan Pérez, Empresa X...',
        materials_title: 'Materiales Utilizados',
        spool_label: 'Bobina',
        weight_used: 'Peso usado (g)',
        price_per_kg: 'Precio por kg (€)',
        add_filament: '+ Añadir otro filamento',
        printers_title: 'Tiempo de Impresión',
        printer_label: 'Impresora',
        add_printer: '+ Añadir otra impresora',
        elec_price_label: 'Precio Electricidad (€/kWh)',
        labor_margin_title: 'Mano de Obra y Margen',
        labor_margin_desc: 'Tiempo de operario, amortización y beneficio.',
        operator_time: 'Tiempo de operario',
        labor_cost_label: 'Coste hora operario'
      },
      results: {
        sale_price: 'PRECIO DE VENTA',
        material: 'Coste Material',
        energy: 'Coste Energía',
        amortization: 'Amortización',
        labor: 'Mano de Obra',
        subtotal: 'Subtotal (Costes)',
        margin: 'Beneficio',
        final_price: 'TOTAL FINAL',
        download_pdf: 'Descargar Presupuesto en PDF',
        empty_desc: 'Rellena los datos de la izquierda para generar el presupuesto detallado.'
      },
      pdf: {
        header_title: 'PRESUPUESTO DE IMPRESIÓN 3D',
        date_label: 'Fecha',
        client_label: 'Cliente',
        specifications_title: 'Especificaciones Técnicas',
        material_fallback: 'Material',
        printer_fallback: 'Impresora',
        materials_label: 'Materiales',
        printers_label: 'Tiempo/Impresoras',
        breakdown_title: 'Desglose de Costes',
        final_price: 'PRECIO TOTAL FINAL',
        footer: 'Gracias por confiar en nuestros servicios de impresión 3D.'
      }
    },
    admin: {
      title: 'Panel de Administración',
      subtitle: 'Gestión global y analíticas de la comunidad',
      loading: 'Cargando panel de control...',
      sections: {
        users: 'Usuarios y Actividad',
        announcements: 'Gestión de Anuncios',
        feedback: 'Sugerencias y Reportes',
        printers: 'Impresoras Pendientes',
        filaments: 'Filamentos Pendientes'
      },
      charts: {
        hours: 'Conexiones por Hora (24h)',
        weekly: 'Actividad Semanal'
      },
      announcements: {
        title: 'Publicar Anuncio Oficial',
        form_title: 'Título del anuncio',
        form_content: 'Contenido del mensaje...',
        submit_btn: 'Publicar Anuncio',
        publishing: 'Publicando...',
        success: 'Anuncio publicado con éxito'
      },
      feedback: {
        empty: 'No hay sugerencias pendientes.',
        make_public: 'Hacer Público',
        public: 'Público ✓',
        resolve: 'Resolver'
      },
      table: {
        model: 'Modelo',
        type: 'Tipo',
        material: 'Material',
        color: 'Color',
        action: 'Acción'
      },
      delete_confirm: '¿Seguro que quieres borrar esta entrada permanentemente?'
    }
  },
  en: {
    nav: {
      login: 'Login',
      register: 'Join Free',
      diario: 'Chronicle',
      calculadora: 'Calculator',
      presupuesto: 'Quote',
      bobinas: 'Spools',
      impresoras: 'Printers',
      estadisticas: 'Stats',
      consumibles: 'Supplies',
      ajustes: 'Settings',
      feedback: 'Feedback',
      admin: 'Admin Panel',
      logout: 'Logout'
    },
    landing: {
      badge: 'What filament doesn\'t give you',
      title: 'Your professional tool for <span class="text-gradient">3D printing</span>',
      desc: 'Manage your printers, calculate exact costs, track your inventory, and generate professional quotes in seconds. All in a modern, free platform for the maker community.',
      cta: 'Start now — It\'s free',
      stats: {
        printers: 'Printers',
        filaments: 'Filaments',
        monthly_cost: 'Monthly Cost',
        saved_calcs: 'Calculations'
      },
      features: {
        subtitle: 'Power up your workshop',
        title: 'Advanced tools, <span class="text-gradient">all for free</span>',
        calc: { title: 'Cost Calculator', desc: 'Total precision including electricity, wear, and material.' },
        budget: { title: 'PDF Quotes', desc: 'Generate professional PDFs for your clients instantly.' },
        inventory: { title: 'Stock Management', desc: 'Track your spools and receive low-stock alerts.' },
        public_db: { title: 'Public Database', desc: 'Access shared printer and filament profiles.' },
        stats: { title: 'Usage Statistics', desc: 'Visualize your consumption and savings over time.' },
        mobile: { title: 'Pro-Mobile Design', desc: 'Manage your print farm from anywhere.' }
      },
      how_it_works: {
        subtitle: 'Maximum simplicity',
        start: 'How to <span class="text-gradient">start</span>',
        step1: { title: 'Create Account', desc: 'Sign up in less than 10 seconds.' },
        step2: { title: 'Add your Setup', desc: 'Configure your printers and filament spools.' },
        step3: { title: 'Calculate and Export', desc: 'Get exact costs and generate professional quotes.' }
      },
      community: {
        subtitle: 'Maker Community',
        title: 'Support Forum <br /><span class="text-gradient">& Updates</span>',
        desc: 'Connect with other makers, share configurations, and stay up to date with news.',
        loading: 'Loading community board...',
        empty: 'No messages on the board yet.',
        official: 'Official',
        community_tag: 'Community'
      },
      cta_final: {
        subtitle: 'Ready for the next level?',
        title: 'The best way to <span class="text-gradient">start calculating</span>',
        desc: 'Join hundreds of users already optimizing their workflow every day.',
        btn: 'Create my free account'
      },
      footer: 'MyCalc3D — Created with ❤️ by the community.'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure your profile and default values',
      profile: 'Profile',
      email: 'Account Email',
      password: {
        title: 'Change Password',
        desc: 'Update your MyCalc3D access password.',
        new: 'New Password',
        min: 'Min 6 characters',
        update: 'Update Password',
        updating: 'Updating...',
        success: 'Password updated successfully'
      },
      defaults: {
        title: 'Default values',
        desc: 'These values will be used automatically in the calculator if you do not select a specific printer or filament.',
        elec: 'Electricity Price (€/kWh)',
        weight: 'Standard spool weight (g)',
        saved: 'Settings saved',
        saving: 'Saving...',
        save: 'Save settings'
      },
      language: {
        title: 'App Language',
        desc: 'Select the interface language.'
      }
    },
    auth: {
      login_title: 'Welcome back',
      login_subtitle: 'Log in to your account',
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot your password?',
      login_btn: 'Login →',
      logging_in: 'Logging in...',
      no_account: "Don't have an account?",
      register_link: 'Sign up free',
      back_home: '← Back to home',
      error_login: 'Incorrect email or password',
      register_title: 'Create your account',
      register_subtitle: 'Free forever · Unlimited',
      name: 'Name',
      pass_min: 'Min 6 characters',
      register_btn: 'Create free account →',
      creating: 'Creating account...',
      have_account: 'Already have an account?',
      login_link: 'Login',
      register_success: {
        title: 'Almost ready!',
        verify_email: '⚠️ Please check your email!',
        verify_desc: 'We have sent you a confirmation link. **You must verify your account first** before you can log in (check Spam/Junk folder just in case).',
        go_login: 'Go to login →'
      },
      forgot_password: {
        title: 'Recover password',
        desc: 'Enter your email and we will send you a link to reset your password.',
        submit_btn: 'Send recovery link',
        sending: 'Sending...',
        success: 'A recovery email has been sent. Please check your inbox.',
        back_login: 'Back to login'
      },
      update_password: {
        title: 'Reset password',
        desc: 'Enter your new password below.',
        label: 'New password',
        submit_btn: 'Update password',
        updating: 'Updating...',
        success: 'Password updated! Redirecting...'
      }
    },
    common: {
      loading: 'Loading...',
      saving: 'Saving...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      open: 'Open',
      success: 'Success',
      error: 'Error',
      actions: 'Actions',
      search: 'Search...',
      select: 'Select...',
      optional: '(optional)',
      back: 'Back',
      none: 'None',
      verified: 'Verified',
      unverified: 'Unverified',
      confirm_delete: 'Are you sure you want to delete this item?',
      manual_selection: 'Manual selection',
      saved: 'Saved!',
      units: {
        g: 'g',
        kg: 'kg',
        ml: 'ml',
        l: 'L',
        ud: 'ud',
        ud_full: 'Units (ud)'
      }
    },
    printers: {
      title: 'Printers',
      subtitle: 'Your printing equipment',
      add_btn: '+ Add printer',
      empty: {
        title: 'No printers added',
        desc: 'Add printers from our database to have them available for calculations.',
        btn: '+ Add your first printer'
      },
      card: {
        custom: 'Custom printer',
        consumption: 'Consumption (W)',
        edit_consumption: 'Click to edit consumption',
        default_val: 'Default value:',
        manual_tag: 'custom'
      },
      modal: {
        title: 'Add printer',
        tab_db: 'Database',
        tab_manual: 'Manual',
        search_label: 'Search in database',
        search_placeholder: 'Bambu, Prusa, Creality, Artillery...',
        select_label: 'Select printer',
        nickname_label: 'Nickname (optional)',
        nickname_placeholder: 'My Bambu, Shop printer...',
        manual_name: 'Printer name',
        manual_name_placeholder: 'E.g.: Artillery Genius Pro',
        duplicates_warn: 'Possible matches in DB. Is it one of these?',
        wattage_label: 'Consumption (W)',
        wattage_placeholder: '300',
        wattage_hint: 'Typical: 150W–500W',
        type_label: 'Type',
        contribute_label: 'Add to public database',
        contribute_desc: 'Will be added as "unverified" until review',
        save_error: 'Error saving to your printers:',
        contrib_error: 'Error contributing to the database:',
        notes_label: 'Notes'
      }
    },
    spools: {
      title: 'Spools',
      subtitle: 'Filament inventory',
      add_btn: '+ Add spool',
      empty: {
        title: 'No spools',
        desc: 'Add your filament spools to track material remaining.',
        btn: '+ Add first spool'
      },
      card: {
        remaining: 'left',
      },
      modal: {
        title_new: 'New spool',
        title_edit: 'Edit spool',
        tab_catalog: 'Catalog',
        tab_manual: 'Manual',
        search_label: 'Search filament',
        search_placeholder: 'eSUN PLA+, Bambu Black...',
        select_label: 'Select from catalog',
        brand_label: 'Brand',
        brand_placeholder: 'eSUN, Bambu...',
        material_label: 'Material',
        duplicates_title: 'Already in catalog:',
        color_label: 'Color',
        color_placeholder: 'White, Black...',
        color_hex_label: 'Color (hex)',
        weight_total: 'Total weight (g)',
        weight_remaining: 'Remaining (g)',
        price_label: 'Purchase price (€)',
        price_placeholder: 'Optional',
        contribute_label: 'Contribute to public catalog',
        contribute_desc: 'Others can choose this brand/material directly',
        error_save: 'Error saving changes:',
        error_add: 'Error adding spool:',
        error_contrib: 'Error contributing to catalog:'
      }
    },
    chronicle: {
      title: 'Chronicle',
      subtitle: 'Your print history',
      add_btn: '+ New entry',
      loading: 'Loading...',
      empty: {
        title: 'No prints yet',
        desc: 'Record your first print to start tracking history.',
        btn: '+ Add print'
      },
      card: {
        weight: 'Weight:',
        time: 'Time:',
        cost: 'Cost:',
        rating: 'Rating:'
      },
      status: {
        completed: 'Completed',
        failed: 'Failed',
        in_progress: 'In progress'
      },
      modal: {
        title: 'New chronicle entry',
        name_label: 'Name',
        name_placeholder: 'E.g.: Monitor stand',
        desc_label: 'Description (optional)',
        desc_placeholder: 'Notes about this print...',
        weight_label: 'Weight (g)',
        time_label: 'Time (h)',
        cost_label: 'Total cost (€)',
        status_label: 'Status',
        rating_label: 'Rating',
        ratings: {
          5: '5 - Excellent',
          4: '4 - Very well',
          3: '3 - Good',
          2: '2 - Fair',
          1: '1 - Poor'
        }
      }
    },
    calculator: {
      title: 'Calculator',
      subtitle: 'Calculate exact print costs',
      form: {
        custom_printer: 'Custom printer',
        hours: 'Hours',
        minutes: 'Minutes',
        minutes_short: 'min',
        wattage_label: 'Consumption (W)',
        amortization_label: 'Amortization (€/h)',
        margin_label: 'Margin'
      },
      sections: {
        printer: 'Printer',
        filament: 'Filament',
        time_elec: 'Time & Electricity'
      },
      fields: {
        select_printer: 'Select printer',
        manual: 'Manual',
        wattage: 'Power (W)',
        material: 'Material',
        all: 'All',
        filament: 'Filament',
        weight: 'Weight used (g)',
        price_kg: 'Price per kg (€)',
        hours: 'Hours',
        minutes: 'Minutes',
        kwh_price: 'kWh Price (€)',
        amortization: 'Amortization (€/h)'
      },
      btn_calc: 'Calculate cost →',
      results: {
        empty: 'Fill data and press calculate to see breakdown',
        total_cost: 'Total cost',
        breakdown: {
          material: 'Material',
          elec: 'Electricity',
          amort: 'Amortization',
          total: 'TOTAL'
        },
        save_success: 'Calculation saved to your history!',
        save_btn: 'Save calculation',
        saving: 'Saving...',
        quote_hint: 'For quotes with labor and margin, use'
      }
    },
    stats: {
      title: 'Statistics',
      subtitle: 'Summary of your printing activity',
      empty: {
        title: 'No data yet',
        desc: 'Use the calculator to save calculations and see your stats here.'
      },
      labels: {
        total_spend: 'Total spend',
        saved_calcs: 'Saved calcs',
        total_material: 'Total material',
        total_time: 'Total time',
        avg_cost: 'Average cost'
      },
      charts: {
        monthly_spend: 'Monthly Spend'
      },
      saved_table: {
        title: 'Saved calculations',
        date: 'Date',
        name: 'Name',
        material: 'Material',
        actions: 'Actions'
      },
      delete_confirm: 'Are you sure you want to delete this item?'
    },
    consumables: {
      title: 'Consumables',
      subtitle: 'Supply management',
      add_btn: 'Add supply',
      empty: {
        title: 'Empty inventory',
        desc: 'Add your supplies (nozzles, sprays, resins...) to track stock.'
      },
      categories: {
        glue: 'Adhesives/Sprays',
        resin: 'Resins',
        parts: 'Spare parts',
        tools: 'Tools',
        other: 'Others'
      },
      labels: {
        stock: 'Stock',
        unit_price: 'Unit price'
      },
      modal: {
        add_title: 'Add supply',
        edit_title: 'Edit supply',
        name_label: 'Name',
        name_placeholder: 'E.g.: Brass nozzle 0.4, 3DLac...',
        category_label: 'Category',
        unit_label: 'Unit of measure',
        stock_label: 'Current stock',
        price_label: 'Price (€)'
      }
    },
    feedback: {
      title: 'Suggestions & Bugs',
      subtitle: 'Help us improve MyCalc3D by reporting bugs or proposing ideas.',
      error_sending: 'Error sending feedback: ',
      success: {
        title: 'Thank you for your message!',
        desc: 'We have received your suggestion. The team will review it shortly.',
        send_another: 'Send another message'
      },
      form: {
        type_label: 'What do you want to send?',
        suggestion: 'Suggestion',
        bug: 'Report Bug',
        subject_label: 'Subject',
        subject_placeholder: 'E.g.: New feature, Error in calculator...',
        message_label: 'Detailed message',
        message_placeholder: 'Describe your idea or problem with as much detail as possible...',
        submit_btn: 'Send message to admin'
      },
      info: {
        title: 'Why is it important?',
        desc: 'Calc3D is a constantly evolving project. Your feedback goes directly to our Admin Panel, where we review every proposal to implement improvements the community needs.'
      }
    },
    quote: {
      title: 'Quick Quote',
      subtitle: 'Generate professional quotes for your clients',
      default_calc_name: 'Quote',
      calculate_btn: 'Calculate Quote',
      calculating_msg: 'Calculating...',
      sections: {
        client_title: 'Client Information',
        client_name: 'Client Name',
        client_placeholder: 'E.g.: John Doe, Company X...',
        materials_title: 'Materials Used',
        spool_label: 'Spool',
        weight_used: 'Used weight (g)',
        price_per_kg: 'Price per kg (€)',
        add_filament: '+ Add another filament',
        printers_title: 'Print Time',
        printer_label: 'Printer',
        add_printer: '+ Add another printer',
        elec_price_label: 'Elec. Price (€/kWh)',
        labor_margin_title: 'Labor & Margin',
        labor_margin_desc: 'Operator time, amortization and profit.',
        operator_time: 'Operator time',
        labor_cost_label: 'Labor cost (€/h)'
      },
      results: {
        sale_price: 'SALE PRICE',
        material: 'Material Cost',
        energy: 'Energy Cost',
        amortization: 'Amortization',
        labor: 'Labor cost',
        subtotal: 'Subtotal (Costs)',
        margin: 'Profit',
        final_price: 'FINAL TOTAL',
        download_pdf: 'Download PDF Quote',
        empty_desc: 'Fill the data on the left to generate a detailed quote.'
      },
      pdf: {
        header_title: '3D PRINTING QUOTE',
        date_label: 'Date',
        client_label: 'Client',
        specifications_title: 'Technical Specifications',
        material_fallback: 'Material',
        printer_fallback: 'Printer',
        materials_label: 'Materials',
        printers_label: 'Time/Printers',
        breakdown_title: 'Cost Breakdown',
        final_price: 'FINAL TOTAL PRICE',
        footer: 'Thank you for trusting our 3D printing services.'
      }
    },
    admin: {
      title: 'Admin Panel',
      subtitle: 'Global management and community analytics',
      loading: 'Loading control panel...',
      sections: {
        users: 'Users and Activity',
        announcements: 'Announcement Management',
        feedback: 'Feedback and Reports',
        printers: 'Pending Printers',
        filaments: 'Pending Filaments'
      },
      charts: {
        hours: 'Connections per Hour (24h)',
        weekly: 'Weekly Activity'
      },
      announcements: {
        title: 'Post Official Announcement',
        form_title: 'Announcement title',
        form_content: 'Message content...',
        submit_btn: 'Post Announcement',
        publishing: 'Publishing...',
        success: 'Announcement posted successfully'
      },
      feedback: {
        empty: 'No pending feedback.',
        make_public: 'Make Public',
        public: 'Public ✓',
        resolve: 'Resolve'
      },
      table: {
        model: 'Model',
        type: 'Type',
        material: 'Material',
        color: 'Color',
        action: 'Action'
      },
      delete_confirm: 'Are you sure you want to delete this entry permanently?'
    }
  },
  gl: {
    nav: {
      login: 'Iniciar sesión',
      register: 'Comezar gratis',
      diario: 'Diario',
      calculadora: 'Calculadora',
      presupuesto: 'Orzamento',
      bobinas: 'Bobinas',
      impresoras: 'Impresoras',
      estadisticas: 'Estatísticas',
      consumibles: 'Consumibles',
      ajustes: 'Axustes',
      feedback: 'Suxestións',
      admin: 'Panel Admin',
      logout: 'Pechar sesión'
    },
    landing: {
      badge: 'O que o filamento non te dá',
      title: 'A túa ferramenta profesional para a <span class="text-gradient">impresión 3D</span>',
      desc: 'Xestiona as túas impresoras, calcula custos exactos, controla o teu inventario e xera orzamentos profesionais en segundos. Todo nunha plataforma moderna e gratuíta para a comunidade maker.',
      cta: 'Comezar agora — É gratis',
      stats: {
        printers: 'Impresoras',
        filaments: 'Filamentos',
        monthly_cost: 'Custo Mensual',
        saved_calcs: 'Cálculos'
      },
      features: {
        subtitle: 'Potencia o teu taller',
        title: 'Ferramentas avanzadas, <span class="text-gradient">todo gratis</span>',
        calc: { title: 'Calculadora de Custos', desc: 'Precisión total incluíndo luz, desgaste e material.' },
        budget: { title: 'Orzamentos PDF', desc: 'Xera PDFs profesionais para os teus clientes ao instante.' },
        inventory: { title: 'Xestión de Stock', desc: 'Controla as túas bobinas e recibe avisos de baixo nivel.' },
        public_db: { title: 'Base de Datos Pública', desc: 'Accede a perfís de impresoras e filamentos compartidos.' },
        stats: { title: 'Estatísticas de Uso', desc: 'Visualiza o teu consumo e aforro ao longo do tempo.' },
        mobile: { title: 'Deseño Pro-Mobile', desc: 'Xestiona a túa granxa de impresión desde calquera lugar.' }
      },
      how_it_works: {
        subtitle: 'Simplicidade máxima',
        start: 'Como <span class="text-gradient">comezar</span>',
        step1: { title: 'Crea a túa Conta', desc: 'Rexístrate en menos de 10 segundos.' },
        step2: { title: 'Engade o teu Setup', desc: 'Configura as túas impresoras e as túas bobinas de filamento.' },
        step3: { title: 'Calcula e Exporta', desc: 'Obtén custos exactos e xera orzamentos profesionais.' }
      },
      community: {
        subtitle: 'Comunidade Maker',
        title: 'Foro de Soporte <br /><span class="text-gradient">e Actualizacións</span>',
        desc: 'Conéctate con outros makers, comparte configuracións e mantente ao día coas novidades.',
        loading: 'Cargando o muro da comunidade...',
        empty: 'Aínda non hai mensaxes no muro.',
        official: 'Oficial',
        community_tag: 'Comunidade'
      },
      cta_final: {
        subtitle: '¿Listo para o seguinte nivel?',
        title: 'A mellor forma de <span class="text-gradient">comezar a calcular</span>',
        desc: 'Únete a centos de usuarios que xa optimizan o seu fluxo de traballo cada día.',
        btn: 'Crear a miña conta gratuíta'
      },
      footer: 'MyCalc3D — Creado con ❤️ pola comunidade.'
    },
    settings: {
      title: 'Axustes',
      subtitle: 'Configura o teu perfil e valores por defecto',
      profile: 'Perfil',
      email: 'Email da conta',
      password: {
        title: 'Cambiar Contrasinal',
        desc: 'Actualiza o teu contrasinal de acceso a MyCalc3D.',
        new: 'Novo Contrasinal',
        min: 'Mínimo 6 caracteres',
        update: 'Actualizar Contrasinal',
        updating: 'Actualizando...',
        success: 'Contrasinal actualizado correctamente'
      },
      defaults: {
        title: 'Valores por defecto',
        desc: 'Estes valores usaranse automaticamente na calculadora si non seleccionas unha impresora ou filamento específico.',
        elec: 'Prezo Electricidade (€/kWh)',
        weight: 'Peso estándar bobinas (g)',
        saved: 'Axustes gardados',
        saving: 'Gardando...',
        save: 'Gardar axustes'
      },
      language: {
        title: 'Idioma da aplicación',
        desc: 'Selecciona o idioma da interface.'
      }
    },
    auth: {
      login_title: 'Benvido de volta',
      login_subtitle: 'Inicia sesión na túa conta',
      email: 'Email',
      password: 'Contrasinal',
      forgot: 'Esqueciches o teu contrasinal?',
      login_btn: 'Iniciar sesión →',
      logging_in: 'Iniciando sesión...',
      no_account: 'Non tes conta?',
      register_link: 'Rexístrate gratis',
      back_home: '← Volver ao inicio',
      error_login: 'Email ou contrasinal incorrectos',
      register_title: 'Crea a túa conta',
      register_subtitle: 'Gratis para sempre · Sen límites',
      name: 'Nome',
      pass_min: 'Mín. 6 caracteres',
      register_btn: 'Crear conta gratis →',
      creating: 'Creando conta...',
      have_account: 'Xa tes conta?',
      login_link: 'Iniciar sesión',
      register_success: {
        title: 'Case listo!',
        verify_email: '⚠️ Por favor, revisa o teu correo electrónico!',
        verify_desc: 'Enviámosche unha ligazón de confirmación. **Debes verificar a túa conta primeiro** antes de poder iniciar sesión (revisa o cartafol de Spam/Correo non desexado por se acaso).',
        go_login: 'Ir a iniciar sesión →'
      },
      forgot_password: {
        title: 'Recuperar contrasinal',
        desc: 'Introduce o teu email e enviarémosche unha ligazón para restablecer o teu contrasinal.',
        submit_btn: 'Enviar ligazón de recuperación',
        sending: 'Enviando...',
        success: 'Enviouse un correo de recuperación. Revisa a túa bandexa de entrada.',
        back_login: 'Volver a iniciar sesión'
      },
      update_password: {
        title: 'Substituír contrasinal',
        desc: 'Introduce o teu novo contrasinal a continuación.',
        label: 'Novo contrasinal',
        submit_btn: 'Actualizar contrasinal',
        updating: 'Actualizando...',
        success: 'Contrasinal actualizado! Redirixindo...'
      }
    },
    common: {
      loading: 'Cargando...',
      saving: 'Gardando...',
      save: 'Gardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Engadir',
      open: 'Abrir',
      success: 'Éxito',
      error: 'Erro',
      actions: 'Accións',
      search: 'Buscar...',
      select: 'Seleccionar...',
      optional: '(opcional)',
      back: 'Volver',
      none: 'Ningún',
      verified: 'Verificada',
      unverified: 'Non verificada',
      confirm_delete: 'Estás seguro de que queres eliminar este elemento?',
      manual_selection: 'Selección manual',
      saved: '¡Gardado!',
      units: {
        g: 'g',
        kg: 'kg',
        ml: 'ml',
        l: 'L',
        ud: 'ud',
        ud_full: 'Unidades (ud)'
      }
    },
    printers: {
      title: 'Impresoras',
      subtitle: 'Os teus equipos de impresión',
      add_btn: '+ Engadir impresora',
      empty: {
        title: 'Sen impresoras engadidas',
        desc: 'Engade as túas impresoras desde a nosa base de datos para telas dispoñibles ao calcular.',
        btn: '+ Engadir a túa primeira impresora'
      },
      card: {
        custom: 'Impresora personalizada',
        consumption: 'Consumo (W)',
        edit_consumption: 'Clic para editar consumo',
        default_val: 'Valor por defecto:',
        manual_tag: 'personalizado'
      },
      modal: {
        title: 'Engadir impresora',
        tab_db: 'Base de Datos',
        tab_manual: 'Manual',
        search_label: 'Buscar na base de datos',
        search_placeholder: 'Bambu, Prusa, Creality, Artillery...',
        select_label: 'Seleccionar impresora',
        nickname_label: 'Apodo (opcional)',
        nickname_placeholder: 'A miña Bambu, Impresora do taller...',
        manual_name: 'Nome da túa impresora',
        manual_name_placeholder: 'Ex: Artillery Genius Pro',
        duplicates_warn: 'Posibles coincidencias na BD. Non é unha destas?',
        wattage_label: 'Consumo (W)',
        wattage_placeholder: '300',
        wattage_hint: 'Típico: 150W–500W',
        type_label: 'Tipo',
        contribute_label: 'Engadir á base de datos pública',
        contribute_desc: 'Engadirase como "non verificada" ata revisión',
        save_error: 'Erro ao gardar nas túas impresoras:',
        contrib_error: 'Erro ao contribuír á base de datos:',
        notes_label: 'Notas'
      }
    },
    spools: {
      title: 'Bobinas',
      subtitle: 'Inventario de filamentos',
      add_btn: '+ Engadir bobina',
      empty: {
        title: 'Sen bobinas',
        desc: 'Engade as túas bobinas de filamento para facer seguimento do material restante.',
        btn: '+ Engadir primeira bobina'
      },
      card: {
        remaining: 'restantes',
      },
      modal: {
        title_new: 'Nova bobina',
        title_edit: 'Editar bobina',
        tab_catalog: 'Catálogo',
        tab_manual: 'Manual',
        search_label: 'Buscar filamento',
        search_placeholder: 'eSUN PLA+, Bambu Black...',
        select_label: 'Seleccionar do catálogo',
        brand_label: 'Marca',
        brand_placeholder: 'eSUN, Bambu...',
        material_label: 'Material',
        duplicates_title: 'Xa existe no catálogo:',
        color_label: 'Color',
        color_placeholder: 'Branco, Negro...',
        color_hex_label: 'Color (hex)',
        weight_total: 'Peso total (g)',
        weight_remaining: 'Restante (g)',
        price_label: 'Prezo de compra (€)',
        price_placeholder: 'Opcional',
        contribute_label: 'Contribuír ao catálogo público',
        contribute_desc: 'Outros poderán elixir esta marca/material directamente',
        error_save: 'Erro ao gardar cambios:',
        error_add: 'Erro ao engadir bobina:',
        error_contrib: 'Erro ao contribuír ao catálogo:'
      }
    },
    chronicle: {
      title: 'Diario',
      subtitle: 'Historial das túas impresións',
      add_btn: '+ Nova entrada',
      loading: 'Cargando...',
      empty: {
        title: 'Sen impresións aínda',
        desc: 'Rexistra a túa primeira impresión para comezar a levar o historial.',
        btn: '+ Engadir impresión'
      },
      card: {
        weight: 'Peso:',
        time: 'Tempo:',
        cost: 'Custo:',
        rating: 'Puntuación:'
      },
      status: {
        completed: 'Completada',
        failed: 'Fallida',
        in_progress: 'En curso'
      },
      modal: {
        title: 'Nova entrada no diario',
        name_label: 'Nome',
        name_placeholder: 'Ex: Soporte monitor',
        desc_label: 'Descrición (opcional)',
        desc_placeholder: 'Notas sobre esta impresión...',
        weight_label: 'Peso (g)',
        time_label: 'Tempo (h)',
        cost_label: 'Custo total (€)',
        status_label: 'Estado',
        rating_label: 'Valoración',
        ratings: {
          5: '5 - Excelente',
          4: '4 - Moi ben',
          3: '3 - Ben',
          2: '2 - Regular',
          1: '1 - Mal'
        }
      }
    },
    calculator: {
      title: 'Calculadora',
      subtitle: 'Calcula o custo exacto da túa impresión',
      form: {
        custom_printer: 'Impresora personalizada',
        hours: 'Horas',
        minutes: 'Minutos',
        minutes_short: 'min',
        wattage_label: 'Consumo (W)',
        amortization_label: 'Amortización (€/h)',
        margin_label: 'Marxe'
      },
      sections: {
        printer: 'Impresora',
        filament: 'Filamento',
        time_elec: 'Tempo & Electricidade'
      },
      fields: {
        select_printer: 'Seleccionar impresora',
        manual: 'Manual',
        wattage: 'Consumo (W)',
        material: 'Material',
        all: 'Todos',
        filament: 'Filamento',
        weight: 'Peso usado (g)',
        price_kg: 'Prezo por kg (€)',
        hours: 'Horas',
        minutes: 'Minutos',
        kwh_price: 'Prezo kWh (€)',
        amortization: 'Amortización (€/h)'
      },
      btn_calc: 'Calcular custo →',
      results: {
        empty: 'Enche os datos e preme calcular para ver o desglose de custos',
        total_cost: 'Custo total',
        breakdown: {
          material: 'Material',
          elec: 'Electricidade',
          amort: 'Amortización',
          total: 'TOTAL'
        },
        save_success: '¡Cálculo gardado no teu historial!',
        save_btn: 'Gardar cálculo',
        saving: 'Gardando...',
        quote_hint: 'Para orzamentos con man de obra e marxe, usa'
      }
    },
    stats: {
      title: 'Estatísticas',
      subtitle: 'Resumen da túa actividade de impresión',
      empty: {
        title: 'Sen datos aínda',
        desc: 'Usa a calculadora para gardar cálculos e ver aquí as túas estatísticas.'
      },
      labels: {
        total_spend: 'Gasto total',
        saved_calcs: 'Cálculos gardados',
        total_material: 'Material total',
        total_time: 'Tempo total',
        avg_cost: 'Custo medio'
      },
      charts: {
        monthly_spend: 'Gasto mensual'
      },
      saved_table: {
        title: 'Cálculos gardados',
        date: 'Data',
        name: 'Nome',
        material: 'Material',
        actions: 'Accións'
      },
      delete_confirm: '¿Seguro que queres borrar este elemento?'
    },
    consumables: {
      title: 'Consumibles',
      subtitle: 'Xestión de pezas e materiais',
      add_btn: 'Engadir consumible',
      empty: {
        title: 'Inventario baleiro',
        desc: 'Engade os teus consumibles (boquillas, lacas, resinas...) para levar o control do stock.'
      },
      categories: {
        glue: 'Adhesivos/Lacas',
        resin: 'Resinas',
        parts: 'Repostos',
        tools: 'Ferramentas',
        other: 'Outros'
      },
      labels: {
        stock: 'Stock',
        unit_price: 'Prezo unitario'
      },
      modal: {
        add_title: 'Engadir consumible',
        edit_title: 'Editar consumible',
        name_label: 'Nome',
        name_placeholder: 'Ex: Boquilla latón 0.4, Laca 3DLac...',
        category_label: 'Categoría',
        unit_label: 'Unidade de medida',
        stock_label: 'Stock actual',
        price_label: 'Prezo (€)'
      }
    },
    feedback: {
      title: 'Suxestións e Fallos',
      subtitle: 'Axúdanos a mellorar MyCalc3D reportando erros ou propondo ideas.',
      error_sending: 'Erro ao enviar a suxestión: ',
      success: {
        title: '¡Grazas pola túa mensaxe!',
        desc: 'Recibimos a túa suxestión. O equipo de administración revisaraa pronto.',
        send_another: 'Enviar outra mensaxe'
      },
      form: {
        type_label: '¿Que queres enviarnos?',
        suggestion: 'Suxestión',
        bug: 'Reportar Fallo',
        subject_label: 'Asunto',
        subject_placeholder: 'Ex: Nova funcionalidade, Erro na calculadora...',
        message_label: 'Mensaxe detallada',
        message_placeholder: 'Describe a túa idea ou o problema que atopaches co maior detalle posible...',
        submit_btn: 'Enviar mensaxe ao administrador'
      },
      info: {
        title: '¿Por que é importante?',
        desc: 'Calc3D é un proxecto en constante evolución. O teu feedback directo chega ao noso Panel de Administración, onde revisamos cada proposta para implementar as melloras que a comunidade de impresión 3D necesita.'
      }
    },
    quote: {
      title: 'Orzamento Rápido',
      subtitle: 'Xera un orzamento profesional para os teus clientes',
      default_calc_name: 'Orzamento',
      calculate_btn: 'Calcular Orzamento',
      calculating_msg: 'Calculando...',
      sections: {
        client_title: 'Información do Cliente',
        client_name: 'Nome do Cliente',
        client_placeholder: 'Ex: Juan Pérez, Empresa X...',
        materials_title: 'Materiais Utilizados',
        spool_label: 'Bobina',
        weight_used: 'Peso usado (g)',
        price_per_kg: 'Prezo por kg (€)',
        add_filament: '+ Engadir outro filamento',
        printers_title: 'Tempo de Impresión',
        printer_label: 'Impresora',
        add_printer: '+ Engadir outra impresora',
        elec_price_label: 'Prezo Electricidade (€/kWh)',
        labor_margin_title: 'Man de Obra e Marxe',
        labor_margin_desc: 'Tempo de operario, amortización e beneficio.',
        operator_time: 'Tempo de operario',
        labor_cost_label: 'Custo hora operario'
      },
      results: {
        sale_price: 'PREZO DE VENDA',
        material: 'Custo Material',
        energy: 'Custo Enerxía',
        amortization: 'Amortización',
        labor: 'Man de Obra',
        subtotal: 'Subtotal (Custos)',
        margin: 'Beneficio',
        final_price: 'TOTAL FINAL',
        download_pdf: 'Descargar Orzamento en PDF',
        empty_desc: 'Enche os datos da esquerda para xerar o orzamento detallado.'
      },
      pdf: {
        header_title: 'ORZAMENTO DE IMPRESIÓN 3D',
        date_label: 'Data',
        client_label: 'Cliente',
        specifications_title: 'Especificacións Técnicas',
        material_fallback: 'Material',
        printer_fallback: 'Impresora',
        materials_label: 'Materiais',
        printers_label: 'Tempo/Impresoras',
        breakdown_title: 'Desglose de Custos',
        final_price: 'PREZO TOTAL FINAL',
        footer: 'Grazas por confiar nos nosos servizos de impresión 3D.'
      }
    },
    admin: {
      title: 'Panel de Administración',
      subtitle: 'Xestión global e analíticas da comunidade',
      loading: 'Cargando panel de control...',
      sections: {
        users: 'Usuarios e Actividade',
        announcements: 'Xestión de Anuncios',
        feedback: 'Suxestións e Reportes',
        printers: 'Impresoras Pendentes',
        filaments: 'Filamentos Pendentes'
      },
      charts: {
        hours: 'Conexións por Hora (24h)',
        weekly: 'Actividade Semanal'
      },
      announcements: {
        title: 'Publicar Anuncio Oficial',
        form_title: 'Título do anuncio',
        form_content: 'Contido da mensaxe...',
        submit_btn: 'Publicar Anuncio',
        publishing: 'Publicando...',
        success: 'Anuncio publicado con éxito'
      },
      feedback: {
        empty: 'Non hai suxestións pendentes.',
        make_public: 'Facer Público',
        public: 'Público ✓',
        resolve: 'Resolver'
      },
      table: {
        model: 'Modelo',
        type: 'Tipo',
        material: 'Material',
        color: 'Color',
        action: 'Acción'
      },
      delete_confirm: '¿Seguro que queres borrar esta entrada permanentemente?'
    }
  },
  pt: {
    nav: {
      login: 'Entrar',
      register: 'Começar grátis',
      diario: 'Diário',
      calculadora: 'Calculadora',
      presupuesto: 'Orçamento',
      bobinas: 'Bobinas',
      impresoras: 'Impressoras',
      estadisticas: 'Estatísticas',
      consumibles: 'Consumíveis',
      ajustes: 'Ajustes',
      feedback: 'Sugestões',
      admin: 'Painel Admin',
      logout: 'Sair'
    },
    landing: {
      badge: 'O que o filamento não te dá',
      title: 'A sua ferramenta profissional para a <span class="text-gradient">impressão 3D</span>',
      desc: 'Gerencie suas impressoras, calcule custos exatos, controle seu inventário e gere orçamentos profissionais em segundos. Tudo em uma plataforma moderna e gratuita para a comunidade maker.',
      cta: 'Começar agora — É grátis',
      stats: {
        printers: 'Impressoras',
        filaments: 'Filamentos',
        monthly_cost: 'Custo Mensal',
        saved_calcs: 'Cálculos'
      },
      features: {
        subtitle: 'Potencialize sua oficina',
        title: 'Ferramentas avançadas, <span class="text-gradient">tudo grátis</span>',
        calc: { title: 'Calculadora de Custos', desc: 'Precisão total incluindo luz, desgaste e material.' },
        budget: { title: 'Orçamentos PDF', desc: 'Gere PDFs profissionais para seus clientes instantaneamente.' },
        inventory: { title: 'Gestão de Estoque', desc: 'Controle suas bobinas e receba avisos de nível baixo.' },
        public_db: { title: 'Base de Dados Pública', desc: 'Acesse perfis de impressoras e filamentos compartilhados.' },
        stats: { title: 'Estatísticas de Uso', desc: 'Visualize seu consumo e economia ao longo do tempo.' },
        mobile: { title: 'Design Pro-Mobile', desc: 'Gerencie sua fazenda de impressão de qualquer lugar.' }
      },
      how_it_works: {
        subtitle: 'Simplicidade máxima',
        start: 'Como <span class="text-gradient">começar</span>',
        step1: { title: 'Crie sua Conta', desc: 'Registre-se em menos de 10 segundos.' },
        step2: { title: 'Adicione seu Setup', desc: 'Configure suas impressoras e suas bobinas de filamento.' },
        step3: { title: 'Calcule e Exporte', desc: 'Obtenha custos exatos e gere orçamentos profissionais.' }
      },
      community: {
        subtitle: 'Comunidade Maker',
        title: 'Fórum de Suporte <br /><span class="text-gradient">e Atualizações</span>',
        desc: 'Conecte-se com outros makers, compartilhe configurações e mantenha-se em dia com as novidades.',
        loading: 'Carregando o mural da comunidade...',
        empty: 'Ainda não há mensagens no mural.',
        official: 'Oficial',
        community_tag: 'Comunidade'
      },
      cta_final: {
        subtitle: 'Pronto para o próximo nível?',
        title: 'A melhor forma de <span class="text-gradient">começar a calcular</span>',
        desc: 'Junte-se a centenas de usuários que já optimizam seu fluxo de trabalho todos os dias.',
        btn: 'Criar minha conta gratuita'
      },
      footer: 'Calc3D · Feito com ❤️ para a comunidade maker'
    },
    settings: {
      title: 'Ajustes',
      subtitle: 'Configure o seu perfil e valores padrão',
      profile: 'Perfil',
      email: 'Email da conta',
      password: {
        title: 'Alterar Senha',
        desc: 'Atualize a sua senha de acesso ao MyCalc3D.',
        new: 'Nova Senha',
        min: 'Mínimo 6 caracteres',
        update: 'Atualizar Senha',
        updating: 'Atualizando...',
        success: 'Senha atualizada com sucesso'
      },
      defaults: {
        title: 'Valores padrão',
        desc: 'Estes valores serão usados automaticamente na calculadora se você não selecionar uma impressora ou filamento específico.',
        elec: 'Preço da Eletricidade (€/kWh)',
        weight: 'Peso padrão das bobinas (g)',
        saved: 'Ajustes salvos',
        saving: 'Salvando...',
        save: 'Salvar ajustes'
      },
      language: {
        title: 'Idioma do aplicativo',
        desc: 'Selecione o idioma da interface.'
      }
    },
    auth: {
      login_title: 'Bem-vindo de volta',
      login_subtitle: 'Inicie sessão na sua conta',
      email: 'Email',
      password: 'Senha',
      forgot: 'Esqueceu a sua senha?',
      login_btn: 'Entrar →',
      logging_in: 'Entrando...',
      no_account: 'Não tem conta?',
      register_link: 'Registe-se grátis',
      back_home: '← Voltar ao início',
      error_login: 'Email ou senha incorretos',
      register_title: 'Crie a sua conta',
      register_subtitle: 'Grátis para sempre · Sem limites',
      name: 'Nome',
      pass_min: 'Mín. 6 caracteres',
      register_btn: 'Criar conta grátis →',
      creating: 'Criando conta...',
      have_account: 'Já tem conta?',
      login_link: 'Entrar',
      register_success: {
        title: 'Quase pronto!',
        verify_email: '⚠️ Por favor, verifique o seu e-mail!',
        verify_desc: 'Enviamos um link de confirmação. **Você deve verificar sua conta primeiro** antes de poder fazer login (verifique a pasta Spam/Lixo Eletrônico por via das dúvidas).',
        go_login: 'Ir para o login →'
      },
      forgot_password: {
        title: 'Recuperar senha',
        desc: 'Introduza o seu e-mail e enviaremos um link para redefinir a sua senha.',
        submit_btn: 'Enviar link de recuperação',
        sending: 'Enviando...',
        success: 'Um e-mail de recuperação foi enviado. Por favor, verifique sua caixa de entrada.',
        back_login: 'Voltar ao login'
      },
      update_password: {
        title: 'Redefinir senha',
        desc: 'Introduza a sua nova senha abaixo.',
        label: 'Nova senha',
        submit_btn: 'Atualizar senha',
        updating: 'Atualizando...',
        success: 'Senha atualizada! Redirecionando...'
      }
    },
    common: {
      loading: 'Carregando...',
      saving: 'Salvando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Adicionar',
      open: 'Abrir',
      success: 'Sucesso',
      error: 'Erro',
      actions: 'Ações',
      search: 'Procurar...',
      select: 'Selecionar...',
      optional: '(opcional)',
      back: 'Voltar',
      none: 'Nenhum',
      verified: 'Verificada',
      unverified: 'Não verificada',
      confirm_delete: 'Tem certeza de que deseja excluir este item?',
      manual_selection: 'Seleção manual',
      saved: '¡Salvo!',
      units: {
        g: 'g',
        kg: 'kg',
        ml: 'ml',
        l: 'L',
        ud: 'ud',
        ud_full: 'Unidades (ud)'
      }
    },
    printers: {
      title: 'Impressoras',
      subtitle: 'Os seus equipamentos de impressão',
      add_btn: '+ Adicionar impressora',
      empty: {
        title: 'Sem impressoras adicionadas',
        desc: 'Adicione as suas impressoras da nossa base de datos para tê-las disponíveis ao calcular.',
        btn: '+ Adicionar a sua primeira impressora'
      },
      card: {
        custom: 'Impressora personalizada',
        consumption: 'Consumo (W)',
        edit_consumption: 'Clique para editar consumo',
        default_val: 'Valor padrão:',
        manual_tag: 'personalizado'
      },
      modal: {
        title: 'Adicionar impressora',
        tab_db: 'Base de Dados',
        tab_manual: 'Manual',
        search_label: 'Procurar na base de datos',
        search_placeholder: 'Bambu, Prusa, Creality, Artillery...',
        select_label: 'Selecionar impressora',
        nickname_label: 'Apelido (opcional)',
        nickname_placeholder: 'A minha Bambu, Impressora da oficina...',
        manual_name: 'Nome da sua impressora',
        manual_name_placeholder: 'Ex: Artillery Genius Pro',
        duplicates_warn: 'Possíveis coincidências na BD. Não é uma destas?',
        wattage_label: 'Consumo (W)',
        wattage_placeholder: '300',
        wattage_hint: 'Típico: 150W–500W',
        type_label: 'Tipo',
        contribute_label: 'Adicionar à base de dados pública',
        contribute_desc: 'Será adicionada como "não verificada" até revisão',
        save_error: 'Erro ao salvar nas suas impressoras:',
        contrib_error: 'Erro ao contribuir para a base de datos:',
        notes_label: 'Notas'
      }
    },
    spools: {
      title: 'Bobinas',
      subtitle: 'Inventário de filamentos',
      add_btn: '+ Adicionar bobina',
      empty: {
        title: 'Sem bobinas',
        desc: 'Adicione as suas bobinas de filamento para rastrear o material restante.',
        btn: '+ Adicionar primeira bobina'
      },
      card: {
        remaining: 'restantes',
      },
      modal: {
        title_new: 'Nova bobina',
        title_edit: 'Editar bobina',
        tab_catalog: 'Catálogo',
        tab_manual: 'Manual',
        search_label: 'Procurar filamento',
        search_placeholder: 'eSUN PLA+, Bambu Black...',
        select_label: 'Selecionar do catálogo',
        brand_label: 'Marca',
        brand_placeholder: 'eSUN, Bambu...',
        material_label: 'Material',
        duplicates_title: 'Já existe no catálogo:',
        color_label: 'Cor',
        color_placeholder: 'Branco, Preto...',
        color_hex_label: 'Color (hex)',
        weight_total: 'Peso total (g)',
        weight_remaining: 'Restante (g)',
        price_label: 'Preço de compra (€)',
        price_placeholder: 'Opcional',
        contribute_label: 'Contribuir para o catálogo público',
        contribute_desc: 'Outros poderão escolher esta marca/material diretamente',
        error_save: 'Erro ao salvar alterações:',
        error_add: 'Erro ao adicionar bobina:',
        error_contrib: 'Erro ao contribuir para o catálogo:'
      }
    },
    chronicle: {
      title: 'Diário',
      subtitle: 'Histórico das suas impressões',
      add_btn: '+ Nova entrada',
      loading: 'Carregando...',
      empty: {
        title: 'Sem impressões ainda',
        desc: 'Registe a sua primeira impressão para começar a rastrear o histórico.',
        btn: '+ Adicionar impressão'
      },
      card: {
        weight: 'Peso:',
        time: 'Tempo:',
        cost: 'Custo:',
        rating: 'Avaliação:'
      },
      status: {
        completed: 'Concluída',
        failed: 'Falhou',
        in_progress: 'Em curso'
      },
      modal: {
        title: 'Nova entrada no diário',
        name_label: 'Nome',
        name_placeholder: 'Ex: Suporte monitor',
        desc_label: 'Descrição (opcional)',
        desc_placeholder: 'Notas sobre esta impressão...',
        weight_label: 'Peso (g)',
        time_label: 'Tempo (h)',
        cost_label: 'Custo total (€)',
        status_label: 'Estado',
        rating_label: 'Avaliação',
        ratings: {
          5: '5 - Excelente',
          4: '4 - Muito bem',
          3: '3 - Bom',
          2: '2 - Regular',
          1: '1 - Ruim'
        }
      }
    },
    calculator: {
      title: 'Calculadora',
      subtitle: 'Calcule o custo exato da sua impressão',
      form: {
        custom_printer: 'Impressora personalizada',
        hours: 'Horas',
        minutes: 'Minutos',
        minutes_short: 'min',
        wattage_label: 'Consumo (W)',
        amortization_label: 'Amortização (€/h)',
        margin_label: 'Margem'
      },
      sections: {
        printer: 'Impressora',
        filament: 'Filamento',
        time_elec: 'Tempo & Eletricidade'
      },
      fields: {
        select_printer: 'Selecionar impressora',
        manual: 'Manual',
        wattage: 'Consumo (W)',
        material: 'Material',
        all: 'Todos',
        filament: 'Filamento',
        weight: 'Peso usado (g)',
        price_kg: 'Preço por kg (€)',
        hours: 'Horas',
        minutes: 'Minutos',
        kwh_price: 'Preço kWh (€)',
        amortization: 'Amortização (€/h)'
      },
      btn_calc: 'Calcular custo →',
      results: {
        empty: 'Preencha os datos e prima calcular para ver o detalhamento de custos',
        total_cost: 'Custo total',
        breakdown: {
          material: 'Material',
          elec: 'Eletricidade',
          amort: 'Amortização',
          total: 'TOTAL'
        },
        save_success: '¡Cálculo salvo no seu histórico!',
        save_btn: 'Salvar cálculo',
        saving: 'Salvando...',
        quote_hint: 'Para orçamentos com mão de obra e margem, use'
      }
    },
    stats: {
      title: 'Estatísticas',
      subtitle: 'Resumo da sua atividade de impressão',
      empty: {
        title: 'Sem dados ainda',
        desc: 'Use a calculadora para salvar cálculos e ver aqui as suas estatísticas.'
      },
      labels: {
        total_spend: 'Gasto total',
        saved_calcs: 'Cálculos salvos',
        total_material: 'Material total',
        total_time: 'Tempo total',
        avg_cost: 'Custo médio'
      },
      charts: {
        monthly_spend: 'Gasto mensal'
      },
      saved_table: {
        title: 'Cálculos salvos',
        date: 'Data',
        name: 'Nome',
        material: 'Material',
        actions: 'Ações'
      },
      delete_confirm: '¿Tem certeza que deseja excluir este elemento?'
    },
    consumables: {
      title: 'Consumíveis',
      subtitle: 'Gestão de peças e materiais',
      add_btn: 'Adicionar consumível',
      empty: {
        title: 'Inventário vazio',
        desc: 'Adicione os seus consumíveis (boquilhas, lacas, resinas...) para levar o controle do estoque.'
      },
      categories: {
        glue: 'Adesivos/Lacas',
        resin: 'Resinas',
        parts: 'Repostos',
        tools: 'Ferramentas',
        other: 'Outros'
      },
      labels: {
        stock: 'Estoque',
        unit_price: 'Preço unitário'
      },
      modal: {
        add_title: 'Adicionar consumível',
        edit_title: 'Editar consumível',
        name_label: 'Nome',
        name_placeholder: 'Ex: Boquilha latão 0.4, Laca 3DLac...',
        category_label: 'Categoria',
        unit_label: 'Unidade de medida',
        stock_label: 'Estoque atual',
        price_label: 'Preço (€)'
      }
    },
    feedback: {
      title: 'Sugestões e Falhas',
      subtitle: 'Ajude-nos a melhorar o MyCalc3D relatando erros ou propondo ideias.',
      error_sending: 'Erro ao enviar sugestão: ',
      success: {
        title: 'Obrigado pela sua mensagem!',
        desc: 'Recebemos a sua sugestão. A equipa de administração irá revê-la em breve.',
        send_another: 'Enviar outra mensagem'
      },
      form: {
        type_label: 'O que deseja enviar-nos?',
        suggestion: 'Sugestão',
        bug: 'Relatar Falha',
        subject_label: 'Assunto',
        subject_placeholder: 'Ex: Nova funcionalidade, Erro na calculadora...',
        message_label: 'Mensagem detalhada',
        message_placeholder: 'Descreva a sua ideia ou o problema que encontrou com o maior detalhe possível...',
        submit_btn: 'Enviar mensagem ao administrador'
      },
      info: {
        title: 'Por que é importante?',
        desc: 'O Calc3D é um projeto em constante evolução. O seu feedback direto chega ao nosso Painel de Administração, onde revisamos cada proposta para implementar as melhorias que a comunidade de impressão 3D precisa.'
      }
    },
    quote: {
      title: 'Orçamento Rápido',
      subtitle: 'Gere um orçamento profissional para os seus clientes',
      default_calc_name: 'Orçamento',
      calculate_btn: 'Calcular Orçamento',
      calculating_msg: 'Calculando...',
      sections: {
        client_title: 'Informação do Cliente',
        client_name: 'Nome do Cliente',
        client_placeholder: 'Ex: João Silva, Empresa X...',
        materials_title: 'Materiais Utilizados',
        spool_label: 'Bobina',
        weight_used: 'Peso usado (g)',
        price_per_kg: 'Preço por kg (€)',
        add_filament: '+ Adicionar outro filamento',
        printers_title: 'Tempo de Impressão',
        printer_label: 'Impressora',
        add_printer: '+ Adicionar outra impressora',
        elec_price_label: 'Preço Eletricidade (€/kWh)',
        labor_margin_title: 'Mão de Obra e Margem',
        labor_margin_desc: 'Tempo de operário, amortização e lucro.',
        operator_time: 'Tempo de operário',
        labor_cost_label: 'Custo hora operário'
      },
      results: {
        sale_price: 'PREÇO DE VENDA',
        material: 'Custo Material',
        energy: 'Custo Energia',
        amortization: 'Amortização',
        labor: 'Mão de Obra',
        subtotal: 'Subtotal (Custos)',
        margin: 'Lucro',
        final_price: 'TOTAL FINAL',
        download_pdf: 'Descarregar Orçamento em PDF',
        empty_desc: 'Preencha os dados à esquerda para gerar o orçamento detalhado.'
      },
      pdf: {
        header_title: 'ORÇAMENTO DE IMPRESSÃO 3D',
        date_label: 'Data',
        client_label: 'Cliente',
        specifications_title: 'Especificações Técnicas',
        material_fallback: 'Material',
        printer_fallback: 'Impressora',
        materials_label: 'Materiais',
        printers_label: 'Tempo/Impressoras',
        breakdown_title: 'Resumo de Custos',
        final_price: 'PREÇO TOTAL FINAL',
        footer: 'Obrigado por confiar nos nossos serviços de impressão 3D.'
      }
    },
    admin: {
      title: 'Painel de Administração',
      subtitle: 'Gestão global e analíticas da comunidade',
      loading: 'Carregando painel de controle...',
      sections: {
        users: 'Usuários e Atividade',
        announcements: 'Gestão de Anúncios',
        feedback: 'Sugestões e Relatórios',
        printers: 'Impressoras Pendentes',
        filaments: 'Filamentos Pendentes'
      },
      charts: {
        hours: 'Conexões por Hora (24h)',
        weekly: 'Atividade Semanal'
      },
      announcements: {
        title: 'Publicar Anúncio Oficial',
        form_title: 'Título do anúncio',
        form_content: 'Conteúdo da mensagem...',
        submit_btn: 'Publicar Anúncio',
        publishing: 'Publicando...',
        success: 'Anúncio publicado com sucesso'
      },
      feedback: {
        empty: 'Não há sugestões pendentes.',
        make_public: 'Tornar Público',
        public: 'Público ✓',
        resolve: 'Resolver'
      },
      table: {
        model: 'Modelo',
        type: 'Tipo',
        material: 'Material',
        color: 'Cor',
        action: 'Ação'
      },
      delete_confirm: 'Tem certeza de que deseja excluir esta entrada permanentemente?'
    }
  }
} as const

export type Language = keyof typeof translations
export type TranslationKey = typeof translations.es
