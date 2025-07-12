export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          attachments: string[] | null
          author_id: string | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_published: boolean | null
          publish_date: string | null
          target_audience: string[] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          author_id?: string | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          publish_date?: string | null
          target_audience?: string[] | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          author_id?: string | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean | null
          publish_date?: string | null
          target_audience?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_date: string | null
          check_in_time: string | null
          check_out_time: string | null
          checked_in_by: string | null
          checked_out_by: string | null
          child_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attendance_date?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attendance_date?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_checked_out_by_fkey"
            columns: ["checked_out_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attendance_date: string | null
          check_in_time: string | null
          check_out_time: string | null
          checked_in_by: string | null
          checked_out_by: string | null
          child_id: string | null
          class_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          parent_notified: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attendance_date?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          child_id?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_notified?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attendance_date?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          child_id?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_notified?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_checked_out_by_fkey"
            columns: ["checked_out_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string
          emergency_contact: string | null
          emergency_phone: string | null
          enrollment_date: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          medical_notes: string | null
          pickup_authorized_users: string[] | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          medical_notes?: string | null
          pickup_authorized_users?: string[] | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          medical_notes?: string | null
          pickup_authorized_users?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_assignments: {
        Row: {
          assigned_date: string | null
          class_id: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          teacher_id: string | null
        }
        Insert: {
          assigned_date?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          teacher_id?: string | null
        }
        Update: {
          assigned_date?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          age_group: string
          capacity: number
          color_code: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          schedule_end: string
          schedule_start: string
          updated_at: string | null
        }
        Insert: {
          age_group: string
          capacity?: number
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          schedule_end: string
          schedule_start: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          capacity?: number
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          schedule_end?: string
          schedule_start?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      config_fields: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          label: string
          sort_order: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          sort_order?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          sort_order?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      curriculum: {
        Row: {
          age_group: string
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          learning_objectives: string[] | null
          name: string
          subject_area: string
          updated_at: string | null
        }
        Insert: {
          age_group: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          name: string
          subject_area: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          name?: string
          subject_area?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_assignments: {
        Row: {
          assigned_by: string | null
          class_id: string | null
          created_at: string | null
          curriculum_id: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          start_date: string
        }
        Insert: {
          assigned_by?: string | null
          class_id?: string | null
          created_at?: string | null
          curriculum_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          start_date: string
        }
        Update: {
          assigned_by?: string | null
          class_id?: string | null
          created_at?: string | null
          curriculum_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_assignments_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculum_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_executions: {
        Row: {
          actual_duration: number | null
          actual_end_time: string | null
          actual_start_time: string | null
          challenges_faced: string | null
          class_id: string | null
          completion_status: string | null
          created_at: string | null
          curriculum_item_id: string | null
          execution_date: string
          id: string
          materials_used: string[] | null
          modifications_made: string | null
          next_steps: string | null
          notes: string | null
          photos: string[] | null
          student_engagement: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          challenges_faced?: string | null
          class_id?: string | null
          completion_status?: string | null
          created_at?: string | null
          curriculum_item_id?: string | null
          execution_date: string
          id?: string
          materials_used?: string[] | null
          modifications_made?: string | null
          next_steps?: string | null
          notes?: string | null
          photos?: string[] | null
          student_engagement?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          challenges_faced?: string | null
          class_id?: string | null
          completion_status?: string | null
          created_at?: string | null
          curriculum_item_id?: string | null
          execution_date?: string
          id?: string
          materials_used?: string[] | null
          modifications_made?: string | null
          next_steps?: string | null
          notes?: string | null
          photos?: string[] | null
          student_engagement?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_executions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_executions_curriculum_item_id_fkey"
            columns: ["curriculum_item_id"]
            isOneToOne: false
            referencedRelation: "curriculum_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_executions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_imports: {
        Row: {
          completed_at: string | null
          created_at: string | null
          curriculum_template_id: string | null
          errors_encountered: string[] | null
          id: string
          import_log: Json | null
          import_status: string | null
          import_type: string
          imported_by: string | null
          records_imported: number | null
          source_name: string | null
          source_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          curriculum_template_id?: string | null
          errors_encountered?: string[] | null
          id?: string
          import_log?: Json | null
          import_status?: string | null
          import_type: string
          imported_by?: string | null
          records_imported?: number | null
          source_name?: string | null
          source_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          curriculum_template_id?: string | null
          errors_encountered?: string[] | null
          id?: string
          import_log?: Json | null
          import_status?: string | null
          import_type?: string
          imported_by?: string | null
          records_imported?: number | null
          source_name?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_imports_curriculum_template_id_fkey"
            columns: ["curriculum_template_id"]
            isOneToOne: false
            referencedRelation: "curriculum_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_imports_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_items: {
        Row: {
          activity_type: string
          assessment_criteria: string | null
          created_at: string | null
          curriculum_id: string | null
          day_number: number
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          id: string
          instructions: string | null
          is_active: boolean | null
          learning_goals: string[] | null
          materials_needed: string[] | null
          preparation_notes: string | null
          skills_developed: string[] | null
          time_slot_id: string | null
          title: string
          updated_at: string | null
          week_number: number
        }
        Insert: {
          activity_type: string
          assessment_criteria?: string | null
          created_at?: string | null
          curriculum_id?: string | null
          day_number: number
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          learning_goals?: string[] | null
          materials_needed?: string[] | null
          preparation_notes?: string | null
          skills_developed?: string[] | null
          time_slot_id?: string | null
          title: string
          updated_at?: string | null
          week_number: number
        }
        Update: {
          activity_type?: string
          assessment_criteria?: string | null
          created_at?: string | null
          curriculum_id?: string | null
          day_number?: number
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          learning_goals?: string[] | null
          materials_needed?: string[] | null
          preparation_notes?: string | null
          skills_developed?: string[] | null
          time_slot_id?: string | null
          title?: string
          updated_at?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_items_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculum_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_items_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_templates: {
        Row: {
          age_group: string
          assessment_criteria: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          import_reference: string | null
          import_source: string | null
          is_active: boolean | null
          is_template: boolean | null
          learning_objectives: string[] | null
          materials_list: string[] | null
          name: string
          subject_area: string
          total_weeks: number | null
          updated_at: string | null
        }
        Insert: {
          age_group: string
          assessment_criteria?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          import_reference?: string | null
          import_source?: string | null
          is_active?: boolean | null
          is_template?: boolean | null
          learning_objectives?: string[] | null
          materials_list?: string[] | null
          name: string
          subject_area: string
          total_weeks?: number | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          assessment_criteria?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          import_reference?: string | null
          import_source?: string | null
          is_active?: boolean | null
          is_template?: boolean | null
          learning_objectives?: string[] | null
          materials_list?: string[] | null
          name?: string
          subject_area?: string
          total_weeks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          activity_type: string
          child_id: string | null
          created_at: string | null
          description: string
          duration_minutes: number | null
          id: string
          log_date: string | null
          mood: string | null
          notes: string | null
          skill_tags: string[] | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          child_id?: string | null
          created_at?: string | null
          description: string
          duration_minutes?: number | null
          id?: string
          log_date?: string | null
          mood?: string | null
          notes?: string | null
          skill_tags?: string[] | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          child_id?: string | null
          created_at?: string | null
          description?: string
          duration_minutes?: number | null
          id?: string
          log_date?: string | null
          mood?: string | null
          notes?: string | null
          skill_tags?: string[] | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          class_ids: string[] | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          is_all_classes: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          requires_permission: boolean | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          class_ids?: string[] | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_all_classes?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          requires_permission?: boolean | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          class_ids?: string[] | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_all_classes?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          requires_permission?: boolean | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          participants: string[]
          subject: string
          thread_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          participants: string[]
          subject: string
          thread_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          participants?: string[]
          subject?: string
          thread_type?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          child_id: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          parent_message_id: string | null
          recipient_id: string | null
          sender_id: string | null
          subject: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achievement_date: string | null
          category: string
          child_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_shared_with_parents: boolean | null
          notes: string | null
          photos: string[] | null
          teacher_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          achievement_date?: string | null
          category?: string
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_with_parents?: boolean | null
          notes?: string | null
          photos?: string[] | null
          teacher_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          achievement_date?: string | null
          category?: string
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_with_parents?: boolean | null
          notes?: string | null
          photos?: string[] | null
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_relationships: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_id: string | null
          relationship_type: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relationship_type?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_relationships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_albums: {
        Row: {
          class_id: string | null
          cover_photo_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_shared_with_parents: boolean | null
          name: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_with_parents?: boolean | null
          name: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_with_parents?: boolean | null
          name?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_albums_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_albums_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          photo_id: string | null
          tag_name: string
          tag_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          photo_id?: string | null
          tag_name: string
          tag_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          photo_id?: string | null
          tag_name?: string
          tag_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_tags_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          activity_type: string | null
          album_id: string | null
          album_name: string | null
          caption: string | null
          child_id: string | null
          created_at: string | null
          id: string
          image_url: string
          is_shared_with_parents: boolean | null
          photo_date: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          activity_type?: string | null
          album_id?: string | null
          album_name?: string | null
          caption?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_shared_with_parents?: boolean | null
          photo_date?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string | null
          album_id?: string | null
          album_name?: string | null
          caption?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_shared_with_parents?: boolean | null
          photo_date?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "photo_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          completed_at: string | null
          created_at: string | null
          date_range_end: string | null
          date_range_start: string | null
          description: string | null
          file_url: string | null
          generated_by: string | null
          id: string
          parameters: Json | null
          report_type: string
          status: string | null
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          description?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_type: string
          status?: string | null
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          description?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_type?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          assessment_date: string | null
          child_id: string | null
          created_at: string | null
          current_level: string
          id: string
          next_steps: string | null
          notes: string | null
          progress_percentage: number | null
          skill_name: string
          subject_area: string
          target_level: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          child_id?: string | null
          created_at?: string | null
          current_level: string
          id?: string
          next_steps?: string | null
          notes?: string | null
          progress_percentage?: number | null
          skill_name: string
          subject_area: string
          target_level?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          child_id?: string | null
          created_at?: string | null
          current_level?: string
          id?: string
          next_steps?: string | null
          notes?: string | null
          progress_percentage?: number | null
          skill_name?: string
          subject_area?: string
          target_level?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          severity: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          created_at: string | null
          duration_minutes: number
          end_time: string
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          end_time: string
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          start_time?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      worksheets: {
        Row: {
          child_id: string | null
          completed_date: string | null
          completion_status: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          file_url: string | null
          id: string
          max_score: number | null
          notes: string | null
          score: number | null
          skill_areas: string[] | null
          teacher_id: string | null
          title: string
          updated_at: string | null
          worksheet_type: string | null
        }
        Insert: {
          child_id?: string | null
          completed_date?: string | null
          completion_status?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          score?: number | null
          skill_areas?: string[] | null
          teacher_id?: string | null
          title: string
          updated_at?: string | null
          worksheet_type?: string | null
        }
        Update: {
          child_id?: string | null
          completed_date?: string | null
          completion_status?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          score?: number | null
          skill_areas?: string[] | null
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
          worksheet_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worksheets_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worksheets_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
