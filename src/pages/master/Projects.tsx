
import { useState, useMemo } from "react";
import { Upload, Eye, Trash, Search } from "lucide-react";
import ProjectFilters from "./ProjectFilters";
import ProjectTable from "./ProjectTable";
import ProjectCardMobile from "./ProjectCardMobile";
import ImportProjectsModal from "./ImportProjectsModal";
import ProjectViewModal from "./ProjectViewModal";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DUMMY_PROJECTS = [
  {
    id: "1",
    name: "Main Building Construction",
    location: "Downtown Site",
    assignedEmployees: [
      { id: "e1", name: "John Smith" },
      { id: "e2", name: "Sarah Johnson" }
    ],
    startDate: "2024-12-20",
    endDate: "2025-02-20",
    status: "Active"
  },
  {
    id: "2",
    name: "Bridge Expansion",
    location: "Bridge Zone A",
    assignedEmployees: [{ id: "e3", name: "Emily Davis" }],
    startDate: "2025-01-15",
    endDate: "2025-06-01",
    status: "Inactive"
  },
  {
    id: "3",
    name: "Warehouse Project",
    location: "East Industrial",
    assignedEmployees: [{ id: "e4", name: "Robert Williams" }],
    startDate: "2025-02-10",
    endDate: "2025-04-01",
    status: "Active"
  }
];

const DUMMY_EMPLOYEES = [
  { id: "e1", name: "John Smith" },
  { id: "e2", name: "Sarah Johnson" },
  { id: "e3", name: "Emily Davis" },
  { id: "e4", name: "Robert Williams" },
  { id: "e5", name: "Brian Carson" },
  { id: "e6", name: "Amy Howard" }
];

const DUMMY_LOCATIONS = [
  "Downtown Site", "Bridge Zone A", "East Industrial", "North Express", "Greenfield", "Central Med"
];

const DUMMY_IMPORTED_PROJECTS = [
  {
    id: "np101",
    name: "Highway Renovation",
    location: "North Express",
    assignedEmployees: [
      { id: "e5", name: "Brian Carson" },
      { id: "e6", name: "Amy Howard" }
    ],
    startDate: "2025-03-10",
    endDate: "2025-09-15",
    status: "Active"
  },
  {
    id: "np102",
    name: "School Campus",
    location: "Greenfield",
    assignedEmployees: [{ id: "e2", name: "Sarah Johnson" }],
    startDate: "2025-07-01",
    endDate: "2026-02-15",
    status: "Inactive"
  },
  {
    id: "np103",
    name: "Hospital Wing",
    location: "Central Med",
    assignedEmployees: [
      { id: "e4", name: "Robert Williams" },
      { id: "e3", name: "Emily Davis" }
    ],
    startDate: "2025-05-15",
    endDate: "2026-01-10",
    status: "Active"
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(DUMMY_PROJECTS);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    status: "All",
    dateRange: undefined,
    employee: ""
  });
  const [importOpen, setImportOpen] = useState(false);
  const [viewProject, setViewProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Name filter
      if (filters.name && !p.name.toLowerCase().includes(filters.name.trim().toLowerCase())) 
        return false;
      
      // Location filter
      if (filters.location && filters.location !== "All" && p.location !== filters.location) 
        return false;
      
      // Status filter
      if (filters.status && filters.status !== "All" && p.status !== filters.status) 
        return false;
      
      // Employee filter
      if (filters.employee) {
        const found = p.assignedEmployees.some(e =>
          e.name.toLowerCase().includes(filters.employee.trim().toLowerCase())
        );
        if (!found) return false;
      }
      
      // Date range filter - parse dates properly for comparison
      if (filters.dateRange?.start || filters.dateRange?.end) {
        const projectStartDate = new Date(p.startDate);
        const projectEndDate = new Date(p.endDate);
        
        // Filter by start date
        if (filters.dateRange?.start && projectStartDate < filters.dateRange.start) {
          return false;
        }
        
        // Filter by end date
        if (filters.dateRange?.end && projectEndDate > filters.dateRange.end) {
          return false;
        }
      }
      
      return true;
    });
  }, [projects, filters]);

  // Simulate import (append dummy projects)
  const handleImport = () => {
    setProjects(prev => [
      ...prev,
      ...DUMMY_IMPORTED_PROJECTS.map(p => ({
        ...p,
        id: p.id + "-" + Math.random().toString(36).substring(2, 6)
      }))
    ]);
    setImportOpen(false);
  };

  // Handle project deletion
  const handleDelete = (project) => {
    setProjects((prev) => prev.filter(p => p.id !== project.id));
    setDeleteProject(null);
  };

  // Responsive check
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  return (
    <div className="space-y-5 px-1 pt-5">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-end">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 md:mb-0">Projects</h1>
        <Button
          className="bg-proscape hover:bg-proscape-dark text-white font-medium flex gap-2"
          onClick={() => setImportOpen(true)}
        >
          <Upload className="w-4 h-4" /> Import Projects
        </Button>
      </div>
      <ProjectFilters
        filters={filters}
        setFilters={setFilters}
        locations={DUMMY_LOCATIONS}
        employees={DUMMY_EMPLOYEES}
      />
      <div>
        {/* Desktop Table and Mobile Cards */}
        <div className="hidden md:block">
          <ProjectTable
            projects={filteredProjects}
            onView={setViewProject}
            onDelete={setDeleteProject}
          />
        </div>
        <div className="block md:hidden">
          {filteredProjects.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No projects found</Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCardMobile
                  key={project.id}
                  project={project}
                  onView={setViewProject}
                  onDelete={setDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modals/Dialogs */}
      <ImportProjectsModal open={importOpen} onOpenChange={setImportOpen} onImport={handleImport} />
      <ProjectViewModal project={viewProject} onClose={() => setViewProject(null)} />
      <DeleteProjectDialog project={deleteProject} onCancel={() => setDeleteProject(null)} onConfirm={() => handleDelete(deleteProject)} />
    </div>
  );
}
