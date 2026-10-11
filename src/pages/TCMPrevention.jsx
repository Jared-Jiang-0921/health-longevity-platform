import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TCM_CONSTITUTION_SOURCE, TCM_CONSTITUTIONS } from '../data/tcmConstitutions'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from '../data/tcmPrevention'
import { TCM_DIET_SOURCE, TCM_DIET_TOPICS } from '../data/tcmDiet'
import { TCM_EMOTION_SOURCE, TCM_EMOTION_TOPICS } from '../data/tcmEmotion'
import { TCM_MOVEMENT_SOURCE, TCM_MOVEMENT_TOPICS } from '../data/tcmMovement'
import { TCM_FOOD_BASIS, TCM_LATE_SUMMER, TCM_LATE_SUMMER_RECIPES, TCM_SEASON_PRINCIPLE, TCM_SEASON_RECIPES, TCM_SEASON_SOURCE, TCM_SEASONS } from '../data/tcmSeasons'
import { getTcmPreventionModuleCopy } from '../data/tcmPreventionModuleI18n'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import ModuleAccessHint from '../components/ModuleAccessHint'
import ModulePageHero from '../components/ModulePageHero'
import './TCMPrevention.css'

const TAB_CONSTITUTION = 'constitution'
const TAB_SEASONS = 'seasons'
const TAB_DIET = 'diet'
const TAB_EMOTION = 'emotion'
const TAB_MOVEMENT = 'movement'
const TAB_HERBS = 'herbs'
const TAB_PRESCRIPTIONS = 'prescriptions'

function localeText(field, lang) {
  if (!field) return ''
  if (lang === 'en' || lang === 'ar') return field[lang] || field.zh
  return field.zh
}

function SeasonRecipes({ recipes, lang, label }) {
  if (!recipes?.length) return null
  return (
    <div className="season-recipes">
      <h4>{label}</h4>
      <ol>
        {recipes.map((recipe) => (
          <li key={localeText(recipe.name, 'zh')}>
            <p className="season-recipe-name">{localeText(recipe.name, lang)}</p>
            <p className="season-from">{localeText(recipe.from, lang)}</p>
            <p>{localeText(recipe.method, lang)}</p>
            <p>{localeText(recipe.place, lang)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function TCMPrevention() {
  const { lang } = useLocale()
  const { user } = useAuth()
  const isAdmin = Boolean(user?.site_admin)
  const mod = getTcmPreventionModuleCopy(lang)
  const [activeTab, setActiveTab] = useState(TAB_CONSTITUTION)

  return (
    <div className="page-tcm-prevention">
      <ModulePageHero path="/tcm-prevention" title={mod.bannerTitle}>
        <p className="module-page-hero-line">{mod.bannerLine1}</p>
        <p className="module-page-hero-line">{mod.bannerLine2}</p>
      </ModulePageHero>

      <section className="tcm-header">
        <h2 className="tcm-page-title">{mod.title}</h2>
        <p className="tcm-differentiation">{mod.differentiation}</p>
        <p className="tcm-positioning page-callout">{mod.positioning}</p>
      </section>

      <section className="tcm-toolbar" aria-label={mod.constitution}>
        <div className="tcm-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_CONSTITUTION}
            className={activeTab === TAB_CONSTITUTION ? 'active' : ''}
            onClick={() => setActiveTab(TAB_CONSTITUTION)}
          >
            {mod.constitution}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_SEASONS}
            className={activeTab === TAB_SEASONS ? 'active' : ''}
            onClick={() => setActiveTab(TAB_SEASONS)}
          >
            {mod.season}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_DIET}
            className={activeTab === TAB_DIET ? 'active' : ''}
            onClick={() => setActiveTab(TAB_DIET)}
          >
            {mod.diet}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_EMOTION}
            className={activeTab === TAB_EMOTION ? 'active' : ''}
            onClick={() => setActiveTab(TAB_EMOTION)}
          >
            {mod.emotion}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_MOVEMENT}
            className={activeTab === TAB_MOVEMENT ? 'active' : ''}
            onClick={() => setActiveTab(TAB_MOVEMENT)}
          >
            {mod.movement}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_HERBS}
            className={activeTab === TAB_HERBS ? 'active' : ''}
            onClick={() => setActiveTab(TAB_HERBS)}
          >
            {mod.herbs}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === TAB_PRESCRIPTIONS}
            className={activeTab === TAB_PRESCRIPTIONS ? 'active' : ''}
            onClick={() => setActiveTab(TAB_PRESCRIPTIONS)}
          >
            {mod.rx}
          </button>
        </div>
      </section>

      {activeTab === TAB_CONSTITUTION && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.constitutionH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_CONSTITUTIONS.length} types`
                : lang === 'ar'
                  ? `${TCM_CONSTITUTIONS.length}`
                  : `${TCM_CONSTITUTIONS.length} 种`}
            </p>
          </div>
          <p className="tcm-constitution-lead">{mod.constitutionLead}</p>
          <p className="tcm-constitution-action">
            <Link to="/tcm-prevention/constitution" className="btn-primary">{mod.constitutionStart}</Link>
          </p>
          <p className="tcm-constitution-source">{localeText(TCM_CONSTITUTION_SOURCE, lang)}</p>
          <div className="tcm-grid tcm-grid--constitutions">
            {TCM_CONSTITUTIONS.map((item) => (
              <article
                key={item.id}
                className={`tcm-card constitution-card content-card content-card--padded${item.id === 'balanced' ? ' is-reference' : ''}`}
              >
                <h3>{localeText(item.name, lang)}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtSummary}</dt>
                    <dd>{localeText(item.summary, lang)}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSigns}</dt>
                    <dd>{localeText(item.signs, lang)}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtCare}</dt>
                    <dd>{localeText(item.care, lang)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_SEASONS && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.seasonH2}</h2>
            <p>{mod.seasonCount}</p>
          </div>
          <p className="tcm-constitution-lead">{mod.seasonLead}</p>
          <p className="tcm-constitution-source">{localeText(TCM_SEASON_SOURCE, lang)}</p>
          <p className="tcm-constitution-source">{localeText(TCM_FOOD_BASIS, lang)}</p>
          <article className="tcm-card season-card content-card content-card--padded" data-season="principle">
            <h3>{localeText(TCM_SEASON_PRINCIPLE.title, lang)}</h3>
            <dl className="tcm-dl">
              <div>
                <dt>{mod.dtClassic}</dt>
                <dd>
                  <span className="season-from">{localeText(TCM_SEASON_PRINCIPLE.classicFrom, lang)}</span>
                  {localeText(TCM_SEASON_PRINCIPLE.classic, lang)}
                </dd>
              </div>
              <div>
                <dt>{mod.dtStandard}</dt>
                <dd>
                  <span className="season-from">{localeText(TCM_SEASON_PRINCIPLE.standardFrom, lang)}</span>
                  {localeText(TCM_SEASON_PRINCIPLE.standard, lang)}
                </dd>
              </div>
              <div>
                <dt>{mod.dtNote}</dt>
                <dd>{localeText(TCM_SEASON_PRINCIPLE.note, lang)}</dd>
              </div>
            </dl>
          </article>
          <div className="tcm-grid tcm-grid--seasons">
            {TCM_SEASONS.map((item) => (
              <article key={item.id} className="tcm-card season-card content-card content-card--padded" data-season={item.id}>
                <h3>
                  <span className="season-mark">{localeText(item.name, lang)}</span>
                  <span className="season-organ">{localeText(item.organ, lang)}</span>
                </h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtClassic}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.classicFrom, lang)}</span>
                      {localeText(item.classic, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtStandard}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.standardFrom, lang)}</span>
                      {localeText(item.standard, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtNote}</dt>
                    <dd>{localeText(item.note, lang)}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSafety}</dt>
                    <dd>{localeText(item.caution, lang)}</dd>
                  </div>
                </dl>
                <SeasonRecipes recipes={TCM_SEASON_RECIPES[item.id]} lang={lang} label={mod.dtRecipes} />
              </article>
            ))}
          </div>
          <article className="tcm-card season-card season-card--late content-card content-card--padded" data-season="late-summer">
            <h3>
              <span className="season-mark">{localeText(TCM_LATE_SUMMER.name, lang)}</span>
              <span className="season-organ">{localeText(TCM_LATE_SUMMER.organ, lang)}</span>
            </h3>
            <dl className="tcm-dl">
              {TCM_LATE_SUMMER.classic.map((row) => (
                <div key={localeText(row.from, 'zh')}>
                  <dt>{mod.dtClassic}</dt>
                  <dd>
                    <span className="season-from">{localeText(row.from, lang)}</span>
                    {localeText(row.text, lang)}
                  </dd>
                </div>
              ))}
              <div>
                <dt>{mod.dtStandard}</dt>
                <dd>
                  <span className="season-from">{localeText(TCM_LATE_SUMMER.standardFrom, lang)}</span>
                  {localeText(TCM_LATE_SUMMER.standard, lang)}
                </dd>
              </div>
              <div>
                <dt>{mod.dtNote}</dt>
                <dd>{localeText(TCM_LATE_SUMMER.note, lang)}</dd>
              </div>
              <div>
                <dt>{mod.dtSafety}</dt>
                <dd>{localeText(TCM_LATE_SUMMER.caution, lang)}</dd>
              </div>
            </dl>
            <SeasonRecipes recipes={TCM_LATE_SUMMER_RECIPES} lang={lang} label={mod.dtRecipes} />
          </article>
        </section>
      )}

      {activeTab === TAB_DIET && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.dietH2}</h2>
            <p>{mod.dietCount}</p>
          </div>
          <p className="tcm-constitution-lead">{mod.dietLead}</p>
          <p className="tcm-constitution-source">{localeText(TCM_DIET_SOURCE, lang)}</p>
          <p className="tcm-constitution-action">
            <button type="button" className="btn-primary" onClick={() => setActiveTab(TAB_SEASONS)}>{mod.dietToSeasons}</button>
          </p>
          <div className="tcm-grid tcm-grid--diet">
            {TCM_DIET_TOPICS.map((item) => (
              <article key={item.id} className="tcm-card content-card content-card--padded">
                <h3>{localeText(item.name, lang)}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtClassic}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.classicFrom, lang)}</span>
                      {localeText(item.classic, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtStandard}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.standardFrom, lang)}</span>
                      {localeText(item.standard, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtNote}</dt>
                    <dd>{localeText(item.note, lang)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_EMOTION && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.emotionH2}</h2>
            <p>{mod.emotionCount}</p>
          </div>
          <p className="tcm-constitution-lead">{mod.emotionLead}</p>
          <p className="tcm-constitution-source">{localeText(TCM_EMOTION_SOURCE, lang)}</p>
          <div className="tcm-grid tcm-grid--emotion">
            {TCM_EMOTION_TOPICS.map((item) => (
              <article key={item.id} className="tcm-card content-card content-card--padded">
                <h3>{localeText(item.name, lang)}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{item.classicKind === 'boundary' ? mod.dtBoundary : mod.dtClassic}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.classicFrom, lang)}</span>
                      {localeText(item.classic, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtStandard}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.standardFrom, lang)}</span>
                      {localeText(item.standard, lang)}
                    </dd>
                  </div>
                  {item.modern ? (
                    <div>
                      <dt>{mod.dtModern}</dt>
                      <dd>
                        <span className="season-from">{localeText(item.modernFrom, lang)}</span>
                        {localeText(item.modern, lang)}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{mod.dtNote}</dt>
                    <dd>{localeText(item.note, lang)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_MOVEMENT && (
        <section className="tcm-section" role="tabpanel">
          <div className="tcm-list-heading">
            <h2>{mod.movementH2}</h2>
            <p>{mod.movementCount}</p>
          </div>
          <p className="tcm-constitution-lead">{mod.movementLead}</p>
          <p className="tcm-constitution-source">{localeText(TCM_MOVEMENT_SOURCE, lang)}</p>
          <div className="tcm-grid tcm-grid--movement">
            {TCM_MOVEMENT_TOPICS.map((item) => (
              <article key={item.id} className="tcm-card content-card content-card--padded">
                <h3>{localeText(item.name, lang)}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{item.classicKind === 'boundary' ? mod.dtBoundary : mod.dtClassic}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.classicFrom, lang)}</span>
                      {localeText(item.classic, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt>{mod.dtStandard}</dt>
                    <dd>
                      <span className="season-from">{localeText(item.standardFrom, lang)}</span>
                      {localeText(item.standard, lang)}
                    </dd>
                  </div>
                  {item.routine ? (
                    <div>
                      <dt>{mod.dtRoutine}</dt>
                      <dd>
                        <span className="season-from">{localeText(item.routineFrom, lang)}</span>
                        {localeText(item.routine, lang)}
                      </dd>
                    </div>
                  ) : null}
                  {item.modern ? (
                    <div>
                      <dt>{mod.dtModern}</dt>
                      <dd>
                        <span className="season-from">{localeText(item.modernFrom, lang)}</span>
                        {localeText(item.modern, lang)}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{mod.dtNote}</dt>
                    <dd>{localeText(item.note, lang)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_HERBS && (
        <section className="tcm-section">
          <div className="tcm-list-heading">
            <h2>{mod.herbsH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_HERBS.length} herbs`
                : lang === 'ar'
                  ? `${TCM_HERBS.length}`
                  : `${TCM_HERBS.length} 味`}
            </p>
          </div>
          <div className="tcm-grid">
            {TCM_HERBS.map((herb) => (
              <article key={herb.id} className="tcm-card herb-card content-card content-card--padded">
                <h3>{herb.name}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtProperty}</dt>
                    <dd>{herb.property}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtEfficacy}</dt>
                    <dd>{herb.efficacy}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSuitableFor}</dt>
                    <dd>{herb.suitableFor}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtCaution}</dt>
                    <dd>{herb.caution}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === TAB_PRESCRIPTIONS && (
        <section className="tcm-section">
          <div className="tcm-list-heading">
            <h2>{mod.rxH2}</h2>
            <p>
              {lang === 'en'
                ? `${TCM_PRESCRIPTIONS.length} formulas`
                : lang === 'ar'
                  ? `${TCM_PRESCRIPTIONS.length}`
                  : `${TCM_PRESCRIPTIONS.length} 首`}
            </p>
          </div>
          <div className="tcm-grid">
            {TCM_PRESCRIPTIONS.map((rx) => (
              <article key={rx.id} className="tcm-card prescription-card content-card content-card--padded">
                <h3>{rx.name}</h3>
                <dl className="tcm-dl">
                  <div>
                    <dt>{mod.dtEfficacy}</dt>
                    <dd>{rx.efficacy}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSuitableFor}</dt>
                    <dd>{rx.suitableFor}</dd>
                  </div>
                  <div>
                    <dt>{mod.dtSource}</dt>
                    <dd>{rx.source}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}

      {isAdmin ? null : <ModuleAccessHint moduleKey="tcm-prevention" className="module-access-hint--page-end" />}
    </div>
  )
}
