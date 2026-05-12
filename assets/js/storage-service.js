// ===== STORAGE SERVICE =====
// Camada central de persistência do PlanRun.
// Hoje usa localStorage; no futuro pode trocar por Supabase/Firebase sem reescrever o app.

const StorageService = (() => {
  const APP = 'planebsb';
  const SCHEMA_VERSION = 1;

  function safeParse(value, fallback = null) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn('StorageService: falha ao interpretar JSON.', error);
      return fallback;
    }
  }

  function getRaw(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.warn('StorageService: falha ao ler chave.', key, error);
      return fallback;
    }
  }

  function setRaw(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('StorageService: falha ao salvar chave.', key, error);
      return false;
    }
  }

  function removeRaw(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('StorageService: falha ao remover chave.', key, error);
      return false;
    }
  }

  function getJSON(key, fallback = null) {
    return safeParse(getRaw(key, null), fallback);
  }

  function setJSON(key, value) {
    return setRaw(key, JSON.stringify(value));
  }

  function getCurrentUser() {
    return getRaw(`${APP}_current_user`, 'guest') || 'guest';
  }

  function userKey(suffix, user = getCurrentUser()) {
    return `${user}_${APP}_${suffix}`;
  }

  function legacyKey(name) {
    return `${APP}_${name}`;
  }

  function getKeys(user = getCurrentUser()) {
    return {
      currentUser: `${APP}_current_user`,
      loggedIn: `${APP}_logged_in`,
      completed: userKey('completed_workouts', user),
      custom: userKey('customizations', user),
      workoutFeedback: userKey('workout_feedback', user),
      weeklyCheckins: userKey('weekly_checkins', user),
      adjustmentHistory: userKey('adjustment_history', user),
      plan: userKey('ai_plan', user),
      adopted: userKey('ai_adopted', user),
      legacyCompleted: legacyKey('completed'),
      legacyCustom: legacyKey('custom')
    };
  }

  function isLoggedIn() {
    return getRaw(`${APP}_logged_in`) === 'true';
  }

  function login(user) {
    setRaw(`${APP}_logged_in`, 'true');
    setRaw(`${APP}_current_user`, user || 'guest');
  }

  function logout() {
    removeRaw(`${APP}_logged_in`);
    removeRaw(`${APP}_current_user`);
  }

  function loadCompletedWorkouts() {
    const keys = getKeys();
    return getJSON(keys.completed, getJSON(keys.legacyCompleted, {})) || {};
  }

  function saveCompletedWorkouts(value) {
    return setJSON(getKeys().completed, value || {});
  }

  function loadCustomizations() {
    const keys = getKeys();
    return getJSON(keys.custom, getJSON(keys.legacyCustom, {})) || {};
  }

  function saveCustomizations(value) {
    return setJSON(getKeys().custom, value || {});
  }

  function loadWorkoutFeedback() {
    return getJSON(getKeys().workoutFeedback, {}) || {};
  }

  function saveWorkoutFeedback(value) {
    return setJSON(getKeys().workoutFeedback, value || {});
  }

  function loadWeeklyCheckins() {
    return getJSON(getKeys().weeklyCheckins, {}) || {};
  }

  function saveWeeklyCheckins(value) {
    return setJSON(getKeys().weeklyCheckins, value || {});
  }

  function loadAdjustmentHistory() {
    const value = getJSON(getKeys().adjustmentHistory, []);
    return Array.isArray(value) ? value : [];
  }

  function saveAdjustmentHistory(value) {
    return setJSON(getKeys().adjustmentHistory, Array.isArray(value) ? value : []);
  }

  function loadPlan() {
    return getJSON(getKeys().plan, null);
  }

  function savePlan(plan) {
    return setJSON(getKeys().plan, plan);
  }

  function clearPlan() {
    const keys = getKeys();
    removeRaw(keys.plan);
    removeRaw(keys.adopted);
  }

  function isPlanAdopted() {
    return getRaw(getKeys().adopted) === 'true';
  }

  function setPlanAdopted(value) {
    const keys = getKeys();
    if (value) return setRaw(keys.adopted, 'true');
    return removeRaw(keys.adopted);
  }

  function clearAdaptiveData() {
    saveCompletedWorkouts({});
    saveCustomizations({});
    saveWorkoutFeedback({});
    saveWeeklyCheckins({});
    saveAdjustmentHistory([]);
  }

  function getUserSnapshot() {
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      user: getCurrentUser(),
      isAdopted: isPlanAdopted(),
      plan: loadPlan(),
      completedWorkouts: loadCompletedWorkouts(),
      customizations: loadCustomizations(),
      workoutFeedback: loadWorkoutFeedback(),
      weeklyCheckins: loadWeeklyCheckins(),
      adjustmentHistory: loadAdjustmentHistory()
    };
  }

  function applyUserSnapshot(payload = {}) {
    if (payload.plan) savePlan(payload.plan);
    setPlanAdopted(payload.isAdopted !== false && Boolean(payload.plan));
    saveCompletedWorkouts(payload.completedWorkouts || {});
    saveCustomizations(payload.customizations || {});
    saveWorkoutFeedback(payload.workoutFeedback || {});
    saveWeeklyCheckins(payload.weeklyCheckins || {});
    saveAdjustmentHistory(payload.adjustmentHistory || []);
    return true;
  }

  return {
    version: SCHEMA_VERSION,
    keys: getKeys,
    userKey,
    getCurrentUser,
    isLoggedIn,
    login,
    logout,
    getJSON,
    setJSON,
    getRaw,
    setRaw,
    removeRaw,
    loadCompletedWorkouts,
    saveCompletedWorkouts,
    loadCustomizations,
    saveCustomizations,
    loadWorkoutFeedback,
    saveWorkoutFeedback,
    loadWeeklyCheckins,
    saveWeeklyCheckins,
    loadAdjustmentHistory,
    saveAdjustmentHistory,
    loadPlan,
    savePlan,
    clearPlan,
    isPlanAdopted,
    setPlanAdopted,
    clearAdaptiveData,
    getUserSnapshot,
    applyUserSnapshot
  };
})();
