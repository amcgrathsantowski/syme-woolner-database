import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BaseLoader, PageLoader } from './components/loader';
import './App.css';

const Login = lazy(() => import('./pages/login'));
const WithNavBars = lazy(() => import('./layouts/with-nav-bars'));
const RoleProtectedRote = lazy(() =>
  import('./components/auth/role-protected-route')
);

const MealService = lazy(() => import('./pages/services/meal'));
const ClientService = lazy(() => import('./pages/services/client'));
const ReferralService = lazy(() => import('./pages/services/referral'));
const HarmReductionService = lazy(() =>
  import('./pages/services/harm-reduction')
);
const ManageEmployee = lazy(() =>
  import('./pages/services/employee-management')
);
const Dashboard = lazy(() => import('./pages/dashboard'));
const ErrorPage = lazy(() => import('./pages/error'));

const EventsAndActivities = lazy(() =>
  import('./layouts/events-and-activities')
);
const CoreAvtivity = lazy(() =>
  import('./pages/events-and-activities/core-activity')
);
const ProjectActivity = lazy(() =>
  import('./pages/events-and-activities/project-activity')
);
const SpecialEvent = lazy(() =>
  import('./pages/events-and-activities/special-event')
);
const Reports = lazy(() => import('./pages/reports'));

const ResetPassword = lazy(() => import('./pages/reset-password'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={
            <BaseLoader>
              <Login />
            </BaseLoader>
          }
        />

        <Route
          element={<RoleProtectedRote allowedRoles={['Admin', 'Employee']} />}
        >
          <Route
            element={
              <BaseLoader>
                <WithNavBars />
              </BaseLoader>
            }
          >
            <Route
              path="/dashboard"
              element={
                <PageLoader>
                  <Dashboard />
                </PageLoader>
              }
            />
            <Route
              path="/events-and-activities"
              element={
                <PageLoader>
                  <EventsAndActivities />
                </PageLoader>
              }
            >
              <Route
                index
                element={
                  <Navigate to="/events-and-activities/special-events" />
                }
              />
              <Route
                path="special-events"
                element={
                  <PageLoader>
                    <SpecialEvent />
                  </PageLoader>
                }
              />
              <Route
                path="core-activities"
                element={
                  <PageLoader>
                    <CoreAvtivity />
                  </PageLoader>
                }
              />
              <Route
                path="project-activities"
                element={
                  <PageLoader>
                    <ProjectActivity />
                  </PageLoader>
                }
              />
            </Route>

            <Route path="/services">
              <Route
                path="meal"
                element={
                  <PageLoader>
                    <MealService />
                  </PageLoader>
                }
              />
              <Route
                path="client"
                element={
                  <PageLoader>
                    <ClientService />
                  </PageLoader>
                }
              />
              <Route
                path="referral"
                element={
                  <PageLoader>
                    <ReferralService />
                  </PageLoader>
                }
              />
              <Route
                path="harm-reduction"
                element={
                  <PageLoader>
                    <HarmReductionService />
                  </PageLoader>
                }
              />
            </Route>
            <Route
              path="reports"
              element={
                <PageLoader>
                  <Reports />
                </PageLoader>
              }
            />
          </Route>
        </Route>

        <Route element={<RoleProtectedRote allowedRoles={['Admin']} />}>
          <Route
            element={
              <BaseLoader>
                <WithNavBars />
              </BaseLoader>
            }
          >
            <Route
              path="employee-management"
              element={
                <PageLoader>
                  <ManageEmployee />
                </PageLoader>
              }
            />
          </Route>
        </Route>

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/forbidden"
          element={<ErrorPage type={403} />}
        />

        <Route
          path="*"
          element={<ErrorPage type={404} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
